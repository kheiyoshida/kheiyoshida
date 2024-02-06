import { SwipeOrMouseMove, TouchOrMousePosition } from 'p5utils/src/control'
import { MoveDirection, MoveIntention, TurnIntention } from './types'
import { MoveThreshold } from '../config'

export const resolveSwipe = (swipe: SwipeOrMouseMove, threshold = MoveThreshold): MoveIntention => {
  const direction = []
  if (swipe.x > threshold) {
    direction.push(MoveDirection.right)
  } else if (swipe.x < -threshold) {
    direction.push(MoveDirection.left)
  }
  if (swipe.y > threshold) {
    direction.push(MoveDirection.back)
  } else if (swipe.y < -threshold) {
    direction.push(MoveDirection.front)
  }
  return {
    direction,
  }
}

export const resolveTouch = (touch: TouchOrMousePosition): TurnIntention => {
  const [halfWidth, halfHeight] = [window.innerWidth / 2, window.innerHeight / 2]
  const x = (touch.x - halfWidth) / halfWidth
  const y = (touch.y - halfHeight) / halfHeight
  return { x, y }
}

export const resolveKeys = (keys: number[]): MoveIntention => {
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
    direction,
  }
}

export const resolveMouse = (mouse: TouchOrMousePosition): TurnIntention => {
  const [halfWidth, halfHeight] = [window.innerWidth / 2, window.innerHeight / 2]
  const x = (mouse.x - halfWidth) / halfWidth
  const y = (mouse.y - halfHeight) / halfHeight
  return { x, y }
}
