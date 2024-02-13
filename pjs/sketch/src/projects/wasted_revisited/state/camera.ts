import { VectorAngles } from 'p5utils/src/3d/types'
import { createCamera } from 'p5utils/src/camera'
import { makeCircularMove } from 'p5utils/src/camera/helpers'
import { Camera } from 'p5utils/src/camera/types'
import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { Config } from '../config'

export type CameraState = {
  camera: Camera
  speed: number
  turn: VectorAngles
  reverting: boolean
}

export const init: LazyInit<CameraState> = () => {
  const camera = createCamera()
  const initialSpeed = Config.CameraDefaultMoveSpeed
  camera.setPosition(0, 0, 1000)
  camera.setFocus([0, 0, 0])
  camera.setSpeed(initialSpeed)
  camera.setAbsoluteDirection({ theta: 90, phi: 180 })
  return {
    camera,
    speed: initialSpeed,
    turn: { theta: 0, phi: 0 },
    reverting: false,
  }
}

export const reducers = {
  updateTurn: (s) => (angle: VectorAngles) => {
    if (angle.theta === 0 && angle.phi === 0) {
      s.reverting = true
    } else {
      s.reverting = false
      s.turn = angle
    }
  },
  updateMove:
    (s) =>
    (relativeAngle: VectorAngles, speed: number = Config.CameraMoveSpeed) => {
      s.camera.setRelativeDirection(relativeAngle)
      s.speed = speed
    },
  turnCamera: (s) => () => {
    if (s.reverting) {
      s.turn = { theta: (s.turn.theta * 7) / 8, phi: (s.turn.phi * 7) / 8 }
    }
    s.camera.turnWithFocus(s.turn, [0, 0, 0])
  },
  moveCamera: (s) => () => {
    const { x, y, z } = circularMove({ theta: 0.01, phi: 0.02 }).mult(2000)
    s.camera.setPosition(x, y, z)
  },
} satisfies ReducerMap<CameraState>

const circularMove = makeCircularMove([30, 150])

export const makeCameraStore = () => makeStoreV2<CameraState>(init)(reducers)

export type CameraStore = ReturnType<typeof makeCameraStore>
