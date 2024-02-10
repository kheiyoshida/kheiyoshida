import p5 from 'p5'
import { sumVectorAngles } from '../../3d'
import { VectorAngles } from '../../3d/types'
import { Position3D } from "../../3d/types"
import { TETRAHEDRAL_DEGREE } from '../../constants'
import { ShapeNode } from '../types'

export const createShapeNode = (
  position: Position3D = [0, 0, 0],
  distanceToEachVertex = 50,
  rotate?: VectorAngles
): ShapeNode => ({
  position: new p5.Vector(...position),
  edges: [],
  distanceToEachVertex,
  vertices: [],
  rotate,
})

export const connectShapeNodes = (node1: ShapeNode, node2: ShapeNode): void => {
  node1.edges = [...node1.edges, node2]
  node2.edges = [...node2.edges, node1]
}

/**
 * note: theta axis rotation is not properly working
 */
export const createTetraAngles = (baseAngles: VectorAngles): VectorAngles[] => {
  return [
    baseAngles,
    ...[...Array(3)].map((_, i) =>
      sumVectorAngles(baseAngles, { theta: TETRAHEDRAL_DEGREE, phi: i * 120 })
    ),
  ]
}

export const sortByDistance = (from: p5.Vector) => (a: p5.Vector, b: p5.Vector) =>
  a.dist(from) - b.dist(from)

export const calcPerpendicularVector = ([v1, v2, v3]: p5.Vector[]): p5.Vector => {
  if (!v1 || !v2 || !v3) throw Error(`surface vector is missing`)
  return v2.copy().sub(v1).cross(v3.copy().sub(v1)).normalize()
}

export const calcAverageVector = (vectors: p5.Vector[]): p5.Vector => {
  return new p5.Vector(
    ...vectors
      .reduce((prev, curr) => curr.array().map((value, i) => prev[i] + value), [0, 0, 0])
      .map((value) => value / vectors.length)
  )
}

export const isInTheSameSide = (surfacePerpendicularVector: p5.Vector, position: p5.Vector) => {
  return surfacePerpendicularVector.dot(position) > 0
}
