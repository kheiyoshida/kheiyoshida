import p5 from 'p5'
import {
  vectorToSphericalAngles,
  sumAngles,
  toDegrees,
  vectorFromDegreeAngles,
} from '../3d'
import { Position3D, SphericalAngles } from '../3d/types'

export function getCameraCenter(camera: p5.Camera): Position3D {
  return [camera.centerX, camera.centerY, camera.centerZ]
}

export function getForwardDirAngles(
  cameraCenter: Position3D,
  cameraPosition: Position3D
): SphericalAngles {
  const cameraCenterV = new p5.Vector(...cameraCenter)
  const cameraPositionV = new p5.Vector(...cameraPosition)
  const [theta, phi] = vectorToSphericalAngles(cameraCenterV.sub(cameraPositionV))
  return { theta: toDegrees(theta), phi: toDegrees(phi) }
}

export const makeCircularMove = (thetaRange: [min: number, max: number] = [0, 180]) => {
  let thetaValue = 0
  let phiValue = 0
  const getThetaDegree = makeRangeMapper(thetaRange, (v) => Math.sin(v))
  const getPhiDegree = toDegrees
  return (delta: { theta: number; phi: number }) => {
    thetaValue += delta.theta
    phiValue += delta.phi
    return vectorFromDegreeAngles(getThetaDegree(thetaValue), getPhiDegree(phiValue))
  }
}

export const makeRangeMapper =
  ([min, max]: [min: number, max: number], translate: (v: number) => number) =>
  (value: number) => {
    const midValue = (max + min) / 2
    const oneEquivalent = max - midValue
    return midValue + translate(value) * oneEquivalent
  }

export const turnVectorByAngles = (vector: p5.Vector, angles: SphericalAngles): p5.Vector => {
  const [theta, phi] = vectorToSphericalAngles(vector).map(toDegrees)
  const vectorAngles = { theta, phi }
  const { theta: nt, phi: np } = sumAngles(vectorAngles, angles)
  return vectorFromDegreeAngles(nt, np, vector.mag())
}
