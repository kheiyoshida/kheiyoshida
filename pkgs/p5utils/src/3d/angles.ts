import p5 from 'p5'
import { SphericalAngles } from './types'
import { loop2D, randomIntInclusiveBetween } from 'utils'

export const toRadians = (degree: number) => degree * (Math.PI / 180)
export const toDegrees = (radians: number) => radians / (Math.PI / 180)

/**
 * @returns spherical angels in *degrees*
 * https://en.wikipedia.org/wiki/Vector_fields_in_cylindrical_and_spherical_coordinates
 */
export const vectorToSphericalAngles2 = (vector: p5.Vector): SphericalAngles => {
  const thetaRadians = Math.acos(-vector.y / vector.mag())
  const phiRadians = Math.atan2(vector.x, vector.z)
  return { theta: toDegrees(thetaRadians), phi: toDegrees(phiRadians) }
}

/**
 * @returns spherical angels in *radians*, in tuple
 * @deprecated use `vectorToSphericalAngles2`
 * https://en.wikipedia.org/wiki/Vector_fields_in_cylindrical_and_spherical_coordinates
 */
export const vectorToSphericalAngles = (vector: p5.Vector): [theta: number, phi: number] => {
  const theta = Math.acos(-vector.y / vector.mag())
  const phi = Math.atan2(vector.x, vector.z)
  return [theta > 0 ? theta : Math.PI + theta, makePhiPositive(phi)]
  function makePhiPositive(phi: number) {
    if (phi > 0) return phi
    return Math.PI * 2 + phi
  }
}

export const sumAngles = (...angles: SphericalAngles[]): SphericalAngles => {
  return angles.reduce(
    (prev, curr) => ({ theta: curr.theta + prev.theta, phi: curr.phi + prev.phi }),
    { theta: 0, phi: 0 }
  )
}

export const multAngles = (angles: SphericalAngles, by: number): SphericalAngles => {
  return { theta: angles.theta * by, phi: angles.phi * by }
}

export const divAngles = (angles: SphericalAngles, by: number): SphericalAngles => {
  return { theta: angles.theta / by, phi: angles.phi / by }
}

export const randomAngles = (): SphericalAngles => ({
  theta: randomIntInclusiveBetween(0, 180),
  phi: randomIntInclusiveBetween(0, 360),
})

export const getEvenlyMappedSphericalAngles = (
  divisions: number,
  thetaRange: [number, number] = [30, 150]
): SphericalAngles[] => {
  const angles: SphericalAngles[] = []
  const minTheta = thetaRange[0]
  const thetaUnit = thetaRange[1] - thetaRange[0]
  loop2D(divisions, (t, p) => {
    angles.push({
      theta: (t / (divisions - 1)) * thetaUnit + minTheta,
      phi: (p / divisions) * 360,
    })
  })
  return angles
}

export const vectorFromDegreeAngles = (...args: Parameters<typeof p5.Vector.fromAngles>) =>
  p5.Vector.fromAngles(toRadians(args[0]), toRadians(args[1]), args[2])
