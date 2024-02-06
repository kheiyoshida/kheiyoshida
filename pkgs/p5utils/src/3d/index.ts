import p5 from 'p5'
import { VectorAngles } from './types'
import { randomIntInclusiveBetween } from 'utils'
import { Position3D } from '../camera/types'

export const toRadians = (degree: number) => degree * (Math.PI / 180)
export const toDegrees = (radians: number) => radians / (Math.PI / 180)

/**
 * https://en.wikipedia.org/wiki/Vector_fields_in_cylindrical_and_spherical_coordinates
 */
export const revertToSphericalCoordinate = (vector: p5.Vector): [theta: number, phi: number] => {
  const theta = Math.acos(-vector.y / vector.mag())
  const phi = Math.atan2(vector.x, vector.z)
  return [
    theta > 0 ? theta : Math.PI + theta,
    adjustPhi(phi),
    // phi > 0 ? phi : Math.PI + phi
  ]
}

export const adjustPhi = (phi: number) => {
  if (phi > 0) return phi
  return Math.PI * 2 + phi
}

export const sumVectorAngles = (...angles: VectorAngles[]) => {
  return angles.reduce(
    (prev, curr) => ({ theta: curr.theta + prev.theta, phi: curr.phi + prev.phi }),
    { theta: 0, phi: 0 }
  )
}

export const divVectorAngles = (angles: VectorAngles, by: number) => {
  return { theta: angles.theta / by, phi: angles.phi / by }
}

export const vectorFromDegreeAngles = (...args: Parameters<typeof p5.Vector.fromAngles>) =>
  p5.Vector.fromAngles(toRadians(args[0]), toRadians(args[1]), args[2])

export const randomAngle = () => ({
  theta: randomIntInclusiveBetween(0, 180),
  phi: randomIntInclusiveBetween(0, 360),
})

export const distanceBetweenPositions = (pos1: Position3D, pos2: Position3D) =>
  Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2) + Math.pow(pos1[2] - pos2[2], 2)
  )
