import { detectMove } from 'p5utils/src/control'
import { moveThreshold } from '../constants'
import { Direction } from '../types'

export const bindTouchEvent = (updateDir: (dir: Direction) => void) => {
  p.touchMoved = () => {
    const { x, y } = detectMove()
    if (x > moveThreshold) {
      updateDir('right')
    }
    if (x < -moveThreshold) {
      updateDir('left')
    }
    if (y > moveThreshold) {
      updateDir('back')
    }
    if (y < -moveThreshold) {
      updateDir('go')
    }
  }
  p.touchEnded = () => {
    updateDir(null)
  }
}

export const bindKeyEvent = (updateDir: (dir: Direction) => void) => {
  const detectKey = () => {
    if (p.keyIsDown(p.RIGHT_ARROW)) {
      updateDir('right')
    }
    if (p.keyIsDown(p.LEFT_ARROW)) {
      updateDir('left')
    }
    if (p.keyIsDown(p.UP_ARROW)) {
      updateDir('go')
    }
    if (p.keyIsDown(p.DOWN_ARROW)) {
      updateDir('back')
    }
  }
  p.keyPressed = detectKey
  p.keyReleased = () => {
    updateDir(null)
    detectKey()
  }
}
