import { VectorAngles } from 'p5utils/src/3d/types'
import { createCamera } from 'p5utils/src/camera'
import { Camera } from 'p5utils/src/camera/types'
import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'

export type CameraState = {
  camera: Camera
}

const init: LazyInit<CameraState> = () => {
  const camera = createCamera()
  camera.setPosition(0, 0, 1000)
  camera.setAbsoluteDirection({ theta: 90, phi: 0 })
  camera.setSpeed(20)
  return {
    camera,
  }
}

const reducers = {
  turn: (s) => (angle: VectorAngles) => {
    s.camera.turn(angle)    
  },
  updateMove: (s) => (relativeAngle: VectorAngles, speed?: number) => {
    s.camera.setRelativeDirection(relativeAngle)
    speed && s.camera.setSpeed(speed)
    
  },
} satisfies ReducerMap<CameraState>

export const makeCameraStore = () => makeStoreV2<CameraState>(init)(reducers)

export type CameraStore = ReturnType<typeof makeCameraStore>