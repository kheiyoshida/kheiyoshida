import p5 from 'p5'
import { VectorAngles } from '../data/node/types'
import { revertToSphericalCoordinate, toDegrees } from '../3d'
import { Position3D } from './types'

export function getCameraCenter(camera: p5.Camera): Position3D {
  return [camera.centerX, camera.centerY, camera.centerZ]
}

export function getForwardDir(cameraCenter: Position3D, cameraPosition: Position3D): VectorAngles {
  const cameraCenterV = new p5.Vector(...cameraCenter)
  const cameraPositionV = new p5.Vector(...cameraPosition)
  const [theta, phi] = revertToSphericalCoordinate(cameraCenterV.sub(cameraPositionV))
  return { theta: toDegrees(theta), phi: toDegrees(phi) }
}
