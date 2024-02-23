import {
  SwipeOrMouseMove,
  TouchOrMousePosition,
  makeSwipeTracker,
  normalizeInputValues,
} from 'p5utils/src/control'
import { moveThreshold } from '../constants'
import { MoveDirection } from '../types'
import { ControlIntention } from './types'

export const translateSwipeIntention = ({ x, y }: SwipeOrMouseMove): ControlIntention => {
  const move: MoveDirection[] = []
  if (x > moveThreshold) move.push(MoveDirection.right)
  if (x < -moveThreshold) move.push(MoveDirection.left)
  if (y > moveThreshold) move.push(MoveDirection.back)
  if (y < -moveThreshold) move.push(MoveDirection.front)
  return { move }
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
