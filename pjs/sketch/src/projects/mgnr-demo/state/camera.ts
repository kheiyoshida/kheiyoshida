import { createCamera } from 'p5utils/src/camera'
import { Camera } from 'p5utils/src/camera/types'
import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { FieldRange } from '../constants'
import { Direction } from '../types'

type CameraState = {
  camera: Camera
  dir: Direction
}

const init: LazyInit<CameraState> = () => {
  const camera = createCamera()
  camera.setPosition(0, 0, 0)
  camera.setFocus(undefined)
  camera.setAbsoluteDirection({ theta: 90, phi: 180 })
  camera.setSpeed(20)
  return {
    camera,
    dir: null,
  }
}

const reducers = {
  updateDir: (s) => (dir: Direction) => {
    s.dir = dir
  },
  move: (s) => () => {
    moveCamera(s.camera, s.dir)
  },
  restrictPosition: (s) => (callback?: () => void) => {
    const [x, _, z] = s.camera.position
    if (Math.abs(x) > FieldRange || Math.abs(z) > FieldRange) {
      s.camera.setPosition(0, 0, FieldRange)
      callback && callback()
    }
  },
} satisfies ReducerMap<CameraState>



const moveCamera = (camera: Camera, dir: Direction) => {
  switch (dir) {
    case 'go':
      camera.setSpeed(20)
      camera.move()
      break
    case 'back':
      // camera.setSpeed(-10)
      // camera.move()
      break
    case 'right':
      camera.setRelativeDirection({theta: 0, phi: -0.1})
      camera.turn({ theta: 0, phi: -0.1 })
      break
    case 'left':
      camera.setRelativeDirection({theta: 0, phi: 0.1})
      camera.turn({ theta: 0, phi: 0.1 })
      break
  }
}

export const makeCameraStore = () => makeStoreV2<CameraState>(init)(reducers)
