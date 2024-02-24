import { Position3D, SphericalAngles, multAngles, vectorFromDegreeAngles } from 'p5utils/src/3d'
import { makeSpeedConsumer } from 'p5utils/src/3d/phyisics'
import { createCamera } from 'p5utils/src/camera'
import { Camera } from 'p5utils/src/camera/types'
import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { MoveDirection } from '../types'

type CameraState = {
  camera: Camera
  speed: number
  dirs: MoveDirection[] | null
  mode: CameraMode
  look: SphericalAngles
  lookCenter: Position3D
}

type CameraMode = 'look' | 'move'

const init: LazyInit<CameraState> = () => {
  const camera = createCamera()
  camera.setPosition(0, -100, 0)
  camera.setFocus(undefined)
  camera.setAbsoluteMoveDirection({ theta: 90, phi: 180 })
  camera.setMoveSpeed(20)
  return {
    camera,
    speed: ZeroSpeed,
    dirs: [],
    mode: 'move',
    look: { theta: 0, phi: 0 },
    lookCenter: [0, 0, 0],
  }
}

const ZeroSpeed = 1
const DefaultSpeed = 10

const reducers = {
  toggleMode: (s) => () => {
    if (s.mode === 'look') {
      s.mode = 'move'
      s.camera.turn({ theta: -s.look.theta, phi: 0 })
    } else {
      s.mode = 'look'
      const { theta, phi } = s.camera.forwardDir
      const lookCenter = vectorFromDegreeAngles(theta, phi, 100).add(s.camera.position)
      s.lookCenter = lookCenter.array() as Position3D
    }
  },
  updateMove: (s) => (dirs: CameraState['dirs']) => {
    s.dirs = dirs
    if (s.dirs === null) return
    if (s.dirs.length !== 0) {
      const phiValue = s.dirs.reduce((prev, dir) => prev + DirectionalPhiValues[dir], 0) / s.dirs.length
      s.camera.setRelativeMoveDirection({ theta: 0, phi: phiValue })
    }
    s.speed = DefaultSpeed
  },
  updateTurn: (s) => (relativeAngles: SphericalAngles) => {
    if (s.mode === 'move') {
      s.camera.turn({ ...relativeAngles, theta: 0 })
    } else {
      s.look = multAngles(relativeAngles, 30)
      s.camera.turnWithFocus(s.look, s.lookCenter)
      s.camera.keepFocus()
    }
  },
  move: (s) => () => {
    if (s.speed === 1 || s.mode !== 'move') return
    if (s.dirs === null) {
      s.speed = consumeSpeed(s.speed)
    }
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
