import { SwipeOrMouseMove, TouchOrMousePosition } from 'p5utils/src/control'
import { ControlIntention, MoveDirection, TurnIntention } from './types'
import { MoveThreshold } from '../config'

export const resolveSwipe = (
  swipe: SwipeOrMouseMove,
  threshold = MoveThreshold,
  base = threshold * 4
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

export const resolveKeys = (keys: number[]): ControlIntention => {
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

export const resolveTouch = (touch: TouchOrMousePosition): ControlIntention => {
  const target = resolveToAngleValues(touch)
  return {
    target,
    // move: [MoveDirection.front]
  }
}

export const resolveMouse = (mouse: TouchOrMousePosition): ControlIntention => {
  const turn = resolveToAngleValues(mouse)
  return {
    turn,
  }
}

const resolveToAngleValues = (pos: TouchOrMousePosition): TurnIntention => {
  const [halfWidth, halfHeight] = [window.innerWidth / 2, window.innerHeight / 2]
  const x = (pos.x - halfWidth) / 1200
  const y = (pos.y - halfHeight) / 1200
  return { x, y }
}
