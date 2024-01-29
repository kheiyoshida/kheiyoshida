import { ReducerMap, makeStoreV2 } from 'utils'
import { Camera, createCamera } from './camera'
import p5 from 'p5'

export type CameraState = {
  camera: Camera
}

const initCameraStore = (): CameraState => {
  const camera = createCamera()
  camera.camera.setPosition(0, 0, 0)
  return {
    camera,
  }
}

const cameraStoreReducerMap: ReducerMap<CameraState> = {
  initialMove: (s) => () => {
    s.camera.setMovement(new p5.Vector(0, 1, 0))
  },
}

export const cameraStore = makeStoreV2<CameraState>(initCameraStore)(cameraStoreReducerMap)
