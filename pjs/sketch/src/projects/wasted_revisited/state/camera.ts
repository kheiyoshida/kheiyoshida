import { sumAngles } from 'p5utils/src/3d'
import { SphericalAngles } from 'p5utils/src/3d/types'
import { createCamera } from 'p5utils/src/camera'
import { makeCircularMove } from 'p5utils/src/camera/helpers'
import { Camera } from 'p5utils/src/camera/types'
import {
  LazyInit,
  ReducerMap,
  clamp,
  makePingpongNumberStore,
  makeStoreV2,
  randomFloatBetween,
} from 'utils'
import { Config } from '../config'

export type CameraState = {
  camera: Camera
  speed: number
  turn: SphericalAngles
  reverting: boolean
  move: SphericalAngles
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
    move: { theta: 0.01, phi: 0.02 },
  }
}

export const reducers = {
  updateTurn: (s) => (angle: SphericalAngles) => {
    if (angle.theta === 0 && angle.phi === 0) {
      s.reverting = true
    } else {
      s.reverting = false
      s.turn = angle
    }
  },
  updateMove: (s) => (moveAngle: SphericalAngles) => {
    const newAngle = sumAngles(s.move, moveAngle)
    s.move = {
      theta: clamp(newAngle.theta, -0.03, 0.03),
      phi: clamp(newAngle.phi, -0.03, 0.03),
    }
  },
  turnCamera: (s) => () => {
    if (s.reverting) {
      s.turn = { theta: (s.turn.theta * 7) / 8, phi: (s.turn.phi * 7) / 8 }
    }
    s.camera.turnWithFocus(s.turn, [0, 0, 0])
  },
  moveCamera: (s) => () => {
    dist.renew()
    const { x, y, z } = circularMove(s.move).mult(dist.current)
    s.camera.setPosition(x, y, z)
  },
} satisfies ReducerMap<CameraState>

const circularMove = makeCircularMove([30, 150])

const dist = makePingpongNumberStore(
  () => randomFloatBetween(0, 20),
  ...(Config.CameraDistance as [number, number, number])
)

export const makeCameraStore = () => makeStoreV2<CameraState>(init)(reducers)

export type CameraStore = ReturnType<typeof makeCameraStore>
