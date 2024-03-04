import { TouchOrMousePosition, makeSwipeTracker, normalizeInputValues } from 'p5utils/src/control'
import { MouseControlThreshold, SwipeMoveThreshold } from '../constants'
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

const KeyCodeMap = {
  37: MoveDirection.left,
  38: MoveDirection.front,
  39: MoveDirection.right,
  40: MoveDirection.back,
  87: MoveDirection.front, // W
  65: MoveDirection.left, // A
  83: MoveDirection.back, // S
  68: MoveDirection.right, // D
} as const

export const translateKeyIntention = (keys: number[]): ControlIntention => {
  const direction = []
  for (const key of keys) {
    if (key in KeyCodeMap) {
      direction.push(KeyCodeMap[key as unknown as keyof typeof KeyCodeMap])
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
  const normalized = normalizeInputValues(position, center, 1200)
  return {
    turn: {
      x: Math.abs(normalized.x) > MouseControlThreshold ? normalized.x : 0,
      y: normalized.y
    }
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
