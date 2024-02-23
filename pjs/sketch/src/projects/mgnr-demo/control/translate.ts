import { TouchOrMousePosition, makeSwipeTracker, normalizeInputValues } from 'p5utils/src/control'
import { SwipeMoveThreshold } from '../constants'
import { MoveDirection } from '../types'
import { ControlIntention } from './types'

export const translateSwipeMoveIntention = (
  position: TouchOrMousePosition,
  swipe: ReturnType<typeof makeSwipeTracker>
): ControlIntention => {
  const { x, y } = swipe.getNormalizedValues(position)
  return {
    move: swipeMove(y),
    turn: { x, y },
  }
}

const swipeMove = (y: number) => {
  const move: MoveDirection[] = []
  if (y > SwipeMoveThreshold) move.push(MoveDirection.back)
  else if (y < -SwipeMoveThreshold) move.push(MoveDirection.front)
  return move.length ? move : null
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
    move: direction.length ? direction : null,
  }
}

export const translateMouseIntention = (
  position: TouchOrMousePosition,
  center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
): ControlIntention => {
  return {
    turn: normalizeInputValues(position, center, 1200),
  }
}

export const translateSwipeLookIntention = (
  position: TouchOrMousePosition,
  swipe: ReturnType<typeof makeSwipeTracker>
): ControlIntention => {
  return {
    turn: swipe.getNormalizedValues(position),
  }
}
