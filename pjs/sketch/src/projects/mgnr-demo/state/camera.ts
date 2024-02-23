import { SphericalAngles } from 'p5utils/src/3d'
import { makeSpeedConsumer } from 'p5utils/src/3d/phyisics'
import { createCamera } from 'p5utils/src/camera'
import { Camera } from 'p5utils/src/camera/types'
import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { MoveDirection } from '../types'

type CameraState = {
  camera: Camera
  speed: number
  dirs: MoveDirection[]
}

const init: LazyInit<CameraState> = () => {
  const camera = createCamera()
  camera.setPosition(0, 0, 0)
  camera.setFocus(undefined)
  camera.setAbsoluteMoveDirection({ theta: 90, phi: 180 })
  camera.setMoveSpeed(20)
  return {
    camera,
    speed: ZeroSpeed,
    dirs: [],
  }
}

const ZeroSpeed = 1

const reducers = {
  updateMove: (s) => (dirs: MoveDirection[]) => {
    s.dirs = dirs
    if (s.dirs.length !== 0) {
      s.speed = 10
      const phiValue = dirs.reduce((prev, dir) => prev + DirectionalPhiValues[dir], 0) / dirs.length
      s.camera.setRelativeMoveDirection({ theta: 0, phi: phiValue })
    }
  },
  updateTurn: (s) => (relativeAngles: SphericalAngles) => {
    s.camera.turn({ ...relativeAngles, theta: 0 })
  },
  move: (s) => () => {
    if (s.speed === 1) return
    s.speed = consumeSpeed(s.speed)
    s.camera.setMoveSpeed(s.speed)
    s.camera.move()
  },
} satisfies ReducerMap<CameraState>

const consumeSpeed = makeSpeedConsumer(ZeroSpeed, (s) => (s * 7) / 8)

const DirectionalPhiValues: { [k in MoveDirection]: number } = {
  front: 0,
  back: 180,
  left: 90,
  right: -90,
}

export const makeCameraStore = () => makeStoreV2<CameraState>(init)(reducers)
export type CameraStore = ReturnType<typeof makeCameraStore>
