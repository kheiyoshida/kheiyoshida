import p5 from 'p5'
import { VectorAngles } from 'p5utils/src/3d/types'
import { createCamera } from 'p5utils/src/camera'
import { Camera } from 'p5utils/src/camera/types'
import { LazyInit, ReducerMap, createCosCurveArray, makeStoreV2 } from 'utils'
import { Config } from '../config'
import { makeSpeedConsumer } from 'p5utils/src/3d/phyisics'
import { makeCircularMove } from 'p5utils/src/camera/helpers'

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
    s.turnQueue = createCosCurveArray(
      angle,
      (a, sv) => ({
        theta: a.theta / 20 + a.theta * sv * 0.1,
        phi: a.theta / 20 + a.phi * sv * 0.1,
      }),
      20
    )
  },
  updateMove:
    (s) =>
    (relativeAngle: VectorAngles, speed: number = Config.CameraMoveSpeed) => {
      s.camera.setRelativeDirection(relativeAngle)
      s.speed = speed
    },
  turnCamera: (s) => () => {
    if (!s.turnQueue.length) return
    const [turnDelta] = s.turnQueue.splice(0, 1)
    s.camera.turn(turnDelta)
  },
  moveCamera: (s) => () => {
    // const consume = makeSpeedConsumer(Config.CameraDefaultMoveSpeed, (s) => s * (7 / 8))
    // s.speed = consume(s.speed)
    // s.camera.setSpeed(s.speed)
    // s.camera.move()
    const { x, y, z } = circularMove({ theta: 0.01, phi: 0.02 }).mult(2000)
    s.camera.setPosition(x, y, z)
  },
} satisfies ReducerMap<CameraState>

const circularMove = makeCircularMove([30, 150])

export const makeCameraStore = () => makeStoreV2<CameraState>(init)(reducers)

export type CameraStore = ReturnType<typeof makeCameraStore>
