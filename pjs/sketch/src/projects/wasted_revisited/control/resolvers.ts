import { SwipeOrMouseMove, TouchOrMousePosition } from 'p5utils/src/control'
import { ControlIntention } from './types'

export const resolveMouse = (mouse: TouchOrMousePosition): ControlIntention => {
  return { turn: resolvePosition(mouse) }
}

export const resolvePosition = (position: TouchOrMousePosition, oneEquivalent = 1200) => {
  const [halfWidth, halfHeight] = [window.innerWidth / 2, window.innerHeight / 2]
  const x = (position.x - halfWidth) / oneEquivalent
  const y = (position.y - halfHeight) / oneEquivalent
  return { x, y }
}

export const makeSwipeTracker = () => {
  let swipeStarted: SwipeOrMouseMove
  return {
    start: (position: SwipeOrMouseMove) => {
      swipeStarted = position
    },
    diff: (currentPosition: SwipeOrMouseMove) => {
      return { x: currentPosition.x - swipeStarted.x, y: currentPosition.y - swipeStarted.y }
    },
  }
}

export const resolveSwipe = (
  touch: TouchOrMousePosition,
  swipe: ReturnType<typeof makeSwipeTracker>
): ControlIntention => {
  const diff = swipe.diff(touch)
  const oneEquivalent = 400
  const x = diff.x / oneEquivalent
  const y = diff.y / oneEquivalent
  return { turn: { x, y } }
}
