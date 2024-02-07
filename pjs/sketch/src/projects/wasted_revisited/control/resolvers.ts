import { TouchOrMousePosition } from 'p5utils/src/control'
import { ControlIntention, MoveDirection } from './types'

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

export const resolveMouse = (mouse: TouchOrMousePosition): ControlIntention => {
  const [halfWidth, halfHeight] = [window.innerWidth / 2, window.innerHeight / 2]
  const x = (mouse.x - halfWidth) / 1200
  const y = (mouse.y - halfHeight) / 1200
  return {
    turn: { x, y },
  }
}
