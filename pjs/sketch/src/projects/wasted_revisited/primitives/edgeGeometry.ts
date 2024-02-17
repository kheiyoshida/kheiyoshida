import p5 from 'p5'
import { revertToSphericalCoordinate, toDegrees } from 'p5utils/src/3d'
import { Position3D, VectorAngles } from 'p5utils/src/3d/types'
import * as shape from 'p5utils/src/3dShape'

export const createEdgeGeometry = (length: number): p5.Geometry => {
  const graph = shape.createStickGraph(length, 12, 10)
  return shape.finalizeGeometry(graph)
}

export const createNodeGeometry = (size: number, round: number):p5.Geometry => {
  const graph = shape.createRandomAngularGraph(size, round)
  return shape.finalizeGeometry(graph)
}

export const calcEdgeAngle = (nodePosition: Position3D, edgePosition: Position3D): VectorAngles => {
  const node = new p5.Vector(...nodePosition)
  const edge = new p5.Vector(...edgePosition)
  const [theta, phi] = revertToSphericalCoordinate(edge.sub(node))
  return { theta: toDegrees(theta), phi: toDegrees(phi) }
}
