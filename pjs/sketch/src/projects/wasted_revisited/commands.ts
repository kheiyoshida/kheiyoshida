import { Direction } from "./state/control"

const moveThreshold = 20

export const bindTouchEvent = (updateDir: (dir: Direction) => void) => {
  p.touchMoved = () => {
    if (p.winMouseX > p.pwinMouseX + moveThreshold) {
      updateDir('right')
    }
    if (p.winMouseX < p.pwinMouseX - moveThreshold) {
      updateDir('left')
    }
    if (p.winMouseY > p.pwinMouseY + moveThreshold) {
      updateDir('back')
    }
    if (p.winMouseY < p.pwinMouseY - moveThreshold) {
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
