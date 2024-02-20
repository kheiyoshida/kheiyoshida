/* eslint-disable no-extra-semi */
import p5, { Geometry } from 'p5'
import { Shape, ShapeNode } from './types'
import { calcPerpendicularVector } from './utils'

type pExtended = p5 & { beginGeometry: any; endGeometry: any }

export const geometryFromShape = (shape: Shape): Geometry => {
  ;(p as pExtended).beginGeometry()
  shape.graph.forEach((node) => {
    if (node.vertices.length !== 4) {
      throw Error(`shape must have 4 vertices ${shape.vertices.length}`)
    }
    ;[0, 1, 2, 3].forEach((surfaceNumber) =>
      createSurface(
        node,
        node.vertices.filter((v, i) => i !== surfaceNumber).map((v) => v.position),
        node.vertices[surfaceNumber].position
      )
    )
  })
  return (p as pExtended).endGeometry()
}

const createSurface = (node: ShapeNode, vectors: p5.Vector[], surfaceVector: p5.Vector) => {
  p.beginShape(p.TRIANGLES)
  const fromNode = vectors.map((v) => node.position.copy().sub(v))
  const normal = calcPerpendicularVector(fromNode)
  if (node.position.copy().sub(surfaceVector).dot(normal) < 0) {
    normal.mult(-1)
  }
  p.normal(normal)
  vectors.forEach(vectorVertex)
  p.endShape()
}

const vectorVertex = (v: p5.Vector) => {
  p.vertex(...(v.array() as [number, number, number]))
}
