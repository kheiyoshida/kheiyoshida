import p5 from 'p5'
import { sumAngles } from 'p5utils/src/3d'
import { SphericalAngles } from 'p5utils/src/3d/types'
import { createCamera } from 'p5utils/src/camera'
import { Camera } from 'p5utils/src/camera/types'
import { LazyInit, ReducerMap, createCosCurveArray, makeStoreV2 } from 'utils'
import { Config } from '../config'

export type CameraState = {
  camera: Camera
  speed: number
  turn: SphericalAngles
  target?: p5.Vector
  turnQueue: SphericalAngles[]
}

export const init: LazyInit<CameraState> = () => {
  const camera = createCamera()
  const initialSpeed = Config.CameraDefaultMoveSpeed
  camera.setPosition(0, 0, 500)
  camera.setMoveSpeed(initialSpeed)
  camera.setFocus(undefined)
  camera.setAbsoluteMoveDirection({ theta: 90, phi: 180 })
  return {
    camera,
    speed: initialSpeed,
    target: undefined,
    turn: { theta: 0, phi: 0 },
    turnQueue: [],
  }
}

export const reducers = {
  updateTarget: (s) => (angles: SphericalAngles) => {
    const trueAngles = sumAngles(angles, { theta: -90, phi: -180 })
    s.camera.setRelativeMoveDirection(trueAngles)
    s.speed = Config.CameraMoveSpeed
  },
  updateTurn: (s) => (angle: SphericalAngles) => {
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
    (relativeAngle: SphericalAngles, speed: number = Config.CameraMoveSpeed) => {
      s.camera.setRelativeMoveDirection(relativeAngle)
      s.speed = speed
    },
  turnCamera: (s) => () => {
    if (!s.turnQueue.length) return
    const [turnDelta] = s.turnQueue.splice(0, 1)
    s.camera.turn(turnDelta)
  },
  moveCamera: (s) => () => {
    const moveDelta = s.speed / 8
    const newSpeed = s.speed - moveDelta
    if (newSpeed < Config.CameraDefaultMoveSpeed) {
      s.speed = Config.CameraDefaultMoveSpeed
    } else {
      s.speed = newSpeed
    }
    s.camera.setMoveSpeed(s.speed)
    s.camera.move()
  },
} satisfies ReducerMap<CameraState>

export const makeCameraStore = () => makeStoreV2<CameraState>(init)(reducers)

export type CameraStore = ReturnType<typeof makeCameraStore>
