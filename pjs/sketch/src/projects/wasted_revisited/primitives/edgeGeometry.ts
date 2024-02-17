import p5 from 'p5'
import { revertToSphericalCoordinate, toDegrees } from 'p5utils/src/3d'
import { Position3D, VectorAngles } from 'p5utils/src/3d/types'
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

export const calcEdgeAngle = (nodePosition: Position3D, edgePosition: Position3D): VectorAngles => {
  const node = new p5.Vector(...nodePosition)
  const edge = new p5.Vector(...edgePosition)
  const [theta, phi] = revertToSphericalCoordinate(edge.sub(node))
  return { theta: toDegrees(theta), phi: toDegrees(phi) }
}
