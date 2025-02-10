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
import { CameraDefaultMoveSpeed, CameraDistance } from './constants'

export type CameraState = {
  camera: Camera
  speed: number
  move: SphericalAngles
}

export const init: LazyInit<CameraState> = () => {
  const camera = createCamera()
  const initialSpeed = CameraDefaultMoveSpeed
  camera.setPosition(0, 0, 2000)
  camera.setFocus([0, 0, 0])
  camera.setMoveSpeed(initialSpeed)
  camera.setAbsoluteMoveDirection({ theta: 90, phi: 180 })
  return {
    camera,
    speed: initialSpeed,
    move: { theta: 0, phi: 0.02 },
  }
}

export const reducers = {
  updateMove: (s) => (moveAngle: SphericalAngles) => {
    const newAngle = sumAngles(s.move, moveAngle)
    s.move = {
      theta: clamp(newAngle.theta, -0.03, 0.03),
      phi: clamp(newAngle.phi, -0.03, 0.03),
    }
  },
  moveCamera: (s) => () => {
    dist.renew()
    const { x, y, z } = circularMove(s.move).mult(dist.current)
    s.camera.setPosition(x, y, z)
  },
} satisfies ReducerMap<CameraState>

const circularMove = makeCircularMove([30, 150])

const positiveSin = (val: number) => (1 + Math.sin(val)) / 2

const dist = makePingpongNumberStore(
  () =>
    randomFloatBetween(
      0,
      (positiveSin(p.millis() * 0.0001) * (CameraDistance[1] - CameraDistance[0])) / 100
    ),
  ...(CameraDistance as [number, number, number])
)

export const makeCameraStore = () => makeStoreV2<CameraState>(init)(reducers)
export const cameraStore = makeCameraStore()

export type CameraStore = ReturnType<typeof makeCameraStore>
