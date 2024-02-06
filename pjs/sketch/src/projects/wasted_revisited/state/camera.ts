import p5 from 'p5'
import { divVectorAngles, sumVectorAngles, vectorFromDegreeAngles } from 'p5utils/src/3d'
import { VectorAngles } from 'p5utils/src/3d/types'
import { createCamera } from 'p5utils/src/camera'
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
  camera.setSpeed(initialSpeed)
  camera.setFocus(undefined)
  camera.setAbsoluteDirection({ theta: 90, phi: 180 })
  return {
    camera,
    speed: initialSpeed,
    target: undefined,
    turn: { theta: 0, phi: 0 },
    turnQueue: [],
  }
}

export const makeSinCurveQueue = <T>(
  original: T,
  getVal: (original: T, sinValue: number) => T,
  numOfQueue = 8
) => {
  return [...Array(numOfQueue)].map((_, i) =>
    getVal(original, Math.cos((Math.PI / 2) * (i / numOfQueue)))
  )
}

export const reducers = {
  updateTarget: (s) => (angles: VectorAngles) => {
    const trueAngles = sumVectorAngles(angles, { theta: -90, phi: -180 })
    s.camera.setRelativeDirection(trueAngles)
    // s.turnQueue = makeSinCurveQueue(
    //   trueAngles,
    //   (a, sv) => ({
    //     theta: a.theta / 8 + a.theta * sv * 0.1,
    //     phi: a.theta / 8 + a.phi * sv * 0.1,
    //   }),
    //   4
    // )
    s.speed = Config.CameraMoveSpeed
  },
  updateTurn: (s) => (angle: VectorAngles) => {
    s.turnQueue = makeSinCurveQueue(
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
    const moveDelta = s.speed / 8
    const newSpeed = s.speed - moveDelta
    if (newSpeed < Config.CameraDefaultMoveSpeed) {
      s.speed = Config.CameraDefaultMoveSpeed
    } else {
      s.speed = newSpeed
    }
    s.camera.setSpeed(s.speed)
    s.camera.move()
  },
} satisfies ReducerMap<CameraState>

export const makeCameraStore = () => makeStoreV2<CameraState>(init)(reducers)

export type CameraStore = ReturnType<typeof makeCameraStore>
