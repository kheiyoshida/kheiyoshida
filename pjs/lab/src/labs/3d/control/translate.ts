import { SwipeOrMouseMove, TouchOrMousePosition, normalizeMouseInput } from 'p5utils/src/control'
import { SwipeMoveThreshold } from '../config'
import { ControlIntention, MoveDirection } from './types'

export const translateSwipeIntention = (
  swipe: SwipeOrMouseMove,
  threshold = SwipeMoveThreshold,
): ControlIntention => {
  const turn = {
    x: Math.abs(swipe.x) > threshold ? swipe.x / threshold : 0,
    y: Math.abs(swipe.y) > threshold ? swipe.y / threshold : 0,
  }
  if (Math.abs(turn.x) > 0 || Math.abs(turn.y) > 0) {
    return {turn}
  }
  return {}
}

export const translateKeyIntention = (keys: number[]): ControlIntention => {
  const KeyMap = {
    37: MoveDirection.left,
    38: MoveDirection.front,
    39: MoveDirection.right,
    40: MoveDirection.back,
  } as const
  const direction = []
  for (const key of keys) {
    if (key in KeyMap) {
      direction.push(KeyMap[key as unknown as keyof typeof KeyMap])
    }
  }
  return {
    move: direction,
  }
}

export const translateTouchIntention = (touch: TouchOrMousePosition): ControlIntention => {
  const target = normalizeMouseInput(touch, 400)
  return {
    target,
  }
}

export const translateMouseIntention = (mouse: TouchOrMousePosition): ControlIntention => {
  const turn = normalizeMouseInput(mouse, 1200)
  return {
    turn,
  }
}
