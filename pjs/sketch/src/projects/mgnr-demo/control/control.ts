import p5 from 'p5'
import { makeStore } from 'utils'
import { bindKeyEvent, bindTouchEvent } from './bindInput'
import { variableStore } from '../state'

export type Direction = 'go' | 'back' | 'right' | 'left' | null

const controlStore = makeStore<{
  camera: p5.Camera
  dir: Direction
  fieldRange: number
}>()

export const setupControl = (fieldRange: number, attitudeThreshold: number) => {
  controlStore.init({
    camera: p.createCamera(),
    dir: null,
    fieldRange,
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
      variableStore.updateAttitude('active')
      if (variableStore.current.active > attitudeThreshold) {
        variableStore.resetAttitude('still')
      }
    }
    if (dir === null || dir === 'left' || dir === 'right') {
      variableStore.updateAttitude('still')
      if (variableStore.current.still > attitudeThreshold) {
        variableStore.resetAttitude('active')
      }
    }
    const { active, still } = variableStore.current
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
