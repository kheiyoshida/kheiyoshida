import p5 from 'p5'
import { revertToSphericalCoordinate, toDegrees, vectorFromDegreeAngles } from '../3d'
import { Position3D, VectorAngles } from '../3d/types'

export function getCameraCenter(camera: p5.Camera): Position3D {
  return [camera.centerX, camera.centerY, camera.centerZ]
}

export function getForwardDir(cameraCenter: Position3D, cameraPosition: Position3D): VectorAngles {
  const cameraCenterV = new p5.Vector(...cameraCenter)
  const cameraPositionV = new p5.Vector(...cameraPosition)
  const [theta, phi] = revertToSphericalCoordinate(cameraCenterV.sub(cameraPositionV))
  return { theta: toDegrees(theta), phi: toDegrees(phi) }
}

export const makeCircularMove = (thetaRange: [min: number, max: number] = [0, 180]) => {
  let thetaValue = 0
  let phiValue = 0
  const getThetaDegree = makeRangeMapper(thetaRange, (v) => Math.sin(v))
  const getPhiDegree = toDegrees
  return (delta: {theta: number, phi: number}) => {
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
