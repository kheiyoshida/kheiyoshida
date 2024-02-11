import p5 from 'p5'
import { revertToSphericalCoordinate, toDegrees } from 'p5utils/src/3d'
import { Position3D, VectorAngles } from 'p5utils/src/3d/types'
import * as shape from 'p5utils/src/3dShape'

export const createEdgeGeometry = (length: number): p5.Geometry => {
  const graph = shape.createStickGraph(length, 20, 30)
  const graph2 = shape.createRandomAngularGraph(length/4, 3)
  return shape.finalizeGeometry([...graph, ...graph2])
}

export const calcEdgeAngle = (nodePosition: Position3D, edgePosition: Position3D): VectorAngles => {
  const node = new p5.Vector(...nodePosition)
  const edge = new p5.Vector(...edgePosition)
  const [theta, phi] = revertToSphericalCoordinate(edge.sub(node))
  return { theta: toDegrees(theta), phi: toDegrees(phi) }
}
