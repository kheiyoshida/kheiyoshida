import { createCamera } from 'p5utils/src/camera'
import { Camera } from 'p5utils/src/camera/types'
import { drawAtPosition3D } from 'p5utils/src/render/drawers/draw'
import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { Direction } from './control'

export type CameraState = {
  camera: Camera
}

const init: LazyInit<CameraState> = () => {
  const camera = createCamera()
  camera.setPosition(0, 0, 1000)
  camera.setAbsoluteDirection({ theta: 90, phi: 0 })
  camera.setSpeed(10)
  return {
    camera,
  }
}

const reducers = {
  drawCenter: (s) => () => {
    drawAtPosition3D(s.camera.cameraCenter, () => {
      p.sphere(2)
    })
  },
  turn: (s) => () => {
    const x = p.mouseX - p.windowWidth / 2
    const y = 0
    s.camera.turn({ theta: y / 1000, phi: -x / 1000 })
  },
  updateMoveDirection: (s) => (dir: Direction) => {
    switch (dir) {
      case 'left':
        s.camera.setRelativeDirection({ theta: 0, phi: 90 })
        break
      case 'right':
        s.camera.setRelativeDirection({ theta: 0, phi: -90 })
        break
      case 'go':
        s.camera.setRelativeDirection({ theta: 0, phi: 0 })
        break
      case 'back':
        s.camera.setRelativeDirection({ theta: 0, phi: 180 })
        break
    }
  },
} satisfies ReducerMap<CameraState>

export const cameraStore = makeStoreV2<CameraState>(init)(reducers)
