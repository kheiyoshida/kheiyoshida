import p5 from 'p5'
import { makeStore } from 'p5utils/src/lib/utils/store'
import { bindKeyEvent, bindTouchEvent } from './bindInput'

export type Direction = 'go' | 'back' | 'right' | 'left' | null

const controlStore = makeStore<{
  camera: p5.Camera
  dir: Direction
  fieldRange: number
  active: number
  still: number
}>()

export const setupControl = (fieldRange: number, attitudeThreshold: number) => {
  controlStore.init({
    camera: p.createCamera(),
    dir: null,
    fieldRange,
    active: 0,
    still: 0,
  })

  const updateDir = (dir: Direction) => controlStore.update('dir', dir)
  bindTouchEvent(updateDir)
  bindKeyEvent(updateDir)

  const detectAttitude = ({
    onActive,
    onStill,
  }: {
    onActive: (activeFrames: number) => void
    onStill: (stillFrames: number) => void
  }) => {
    const dir = controlStore.read('dir')
    if (dir === 'go') {
      controlStore.update('active', (f) => f + 1)
      if (controlStore.read('active') > attitudeThreshold) {
        controlStore.update('still', 0)
      }
    }
    if (dir === null || dir === 'left' || dir === 'right') {
      controlStore.update('still', (f) => f + 1)
      if (controlStore.read('still') > attitudeThreshold) {
        controlStore.update('active', 0)
      }
    }
    const { active, still } = controlStore.read()
    onActive(active)
    onStill(still)
  }

  const move = () => {
    const { dir, camera } = controlStore.read()
    switch (dir) {
      case 'go':
        camera.move(0, 0, -20)
        break
      case 'back':
        camera.move(0, 0, 10)
        break
      case 'right':
        camera.pan(-0.1)
        break
      case 'left':
        camera.pan(0.1)
        break
    }
  }

  const restrictPosition = (callback?: () => void) => {
    const camera = controlStore.read('camera')
    if (camera.eyeX > fieldRange) {
      camera.setPosition(-fieldRange, 0, camera.eyeZ)
      camera.lookAt(0, 0, 0)
      callback && callback()
    }
    if (camera.eyeX < -fieldRange) {
      camera.setPosition(fieldRange, 0, camera.eyeZ)
      camera.lookAt(0, 0, 0)
      callback && callback()
    }
    if (camera.eyeZ > fieldRange) {
      camera.setPosition(camera.eyeX, 0, -fieldRange)
      camera.lookAt(0, 0, 0)
      callback && callback()
    }
    if (camera.eyeZ < -fieldRange) {
      camera.setPosition(camera.eyeX, 0, fieldRange)
      camera.lookAt(0, 0, 0)
      callback && callback()
    }
  }

  return {
    move,
    detectAttitude,
    restrictPosition,
  }
}
