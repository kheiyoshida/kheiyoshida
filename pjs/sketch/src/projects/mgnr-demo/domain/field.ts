import {
  Position3D,
  distanceBetweenPositions,
  sumPosition3d,
  vectorBetweenPositions,
} from 'p5utils/src/3d'
import { Camera } from 'p5utils/src/camera/types'
import { CenterToOutsideDistance, GroundY, LookAhead } from '../constants'
import { ObjectStore } from '../state/object'
import { VariableStore } from '../state/variable'

export const cameraReachedEdgeEvent = (
  camera: Camera,
  variableStore: VariableStore,
  objectStore: ObjectStore
) => {
  const forward = forwardPosition(camera, LookAhead)
  if (isCameraOnEdge(forward, variableStore.current.fieldCenter)) {
    const [forwardX, _, forwardZ] = forwardPosition(camera, CenterToOutsideDistance)
    const newFieldCenter: Position3D = [forwardX, GroundY, forwardZ]
    objectStore.replaceTrees(variableStore.current.fieldCenter, newFieldCenter)
    variableStore.updateFieldCenter(newFieldCenter)
  }
}

export const isCameraOnEdge = (
  forward: Position3D,
  fieldCenter: Position3D,
  centerToOutside = CenterToOutsideDistance
): boolean => {
  return distanceBetweenPositions(forward, fieldCenter) >= centerToOutside
}

export const forwardPosition = (camera: Camera, distance: number): Position3D => {
  const direction = vectorBetweenPositions(camera.position, camera.cameraCenter)
    .normalize()
    .mult(distance)
  return sumPosition3d(camera.position, direction.array() as Position3D)
}
