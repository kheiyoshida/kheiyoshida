import p5 from 'p5'
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
  target?: p5.Vector
  turnQueue: VectorAngles[]
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
    target: undefined,
    turn: { theta: 0, phi: 0 },
    turnQueue: [],
  }
}

export const reducers = {
  updateTurn: (s) => (angle: VectorAngles) => {
    s.turn = angle
  },
  updateMove:
    (s) =>
    (relativeAngle: VectorAngles, speed: number = Config.CameraMoveSpeed) => {
      s.camera.setRelativeDirection(relativeAngle)
      s.speed = speed
    },
  turnCamera: (s) => () => {
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
