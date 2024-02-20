import p5 from 'p5'
import { vectorToSphericalAngles2 } from 'p5utils/src/3d'
import { Position3D, SphericalAngles } from 'p5utils/src/3d/types'
import * as shape from 'p5utils/src/3dShape'

const LengthPerUnit = 200

export const createEdgeGeometry = (length: number, radius: number): p5.Geometry => {
  const graph = shape.createStickGraph(
    length,
    Number(Math.max(1, length / LengthPerUnit).toFixed()),
    radius
  )
  return shape.finalizeGeometry(graph)
}

export const createNodeGeometry = (size: number, round: number): p5.Geometry => {
  const graph = shape.createRandomAngularGraph(size, round)
  return shape.finalizeGeometry(graph)
}

export const calcEdgeAngle = (nodePosition: Position3D, edgePosition: Position3D): SphericalAngles => {
  const node = new p5.Vector(...nodePosition)
  const edge = new p5.Vector(...edgePosition)
  return vectorToSphericalAngles2(edge.sub(node))
}
