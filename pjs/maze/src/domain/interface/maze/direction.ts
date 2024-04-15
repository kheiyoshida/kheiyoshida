import { Position, reducePosition } from '../../../utils/position'
import { LR } from '../../../utils/types'

export type Direction = 'n' | 'e' | 's' | 'w'

export const NESW = ['n', 'e', 's', 'w'] as const

export const compass = (d: LR | 'o', currentDirection: Direction) => {
  const i = NESW.indexOf(currentDirection)
  switch (d) {
    case 'right':
      return NESW[(i + 1) % 4]
    case 'left':
      return NESW[(i + 3) % 4]
    case 'o':
      return NESW[(i + 2) % 4]
  }
}

export const positionalDirection = (direction: Direction, distance = 1): Position => {
  switch (direction) {
    case 'n':
      return [-distance, 0]
    case 'e':
      return [0, distance]
    case 's':
      return [distance, 0]
    case 'w':
      return [0, -distance]
  }
}

export const adjacentInDirection = (d: Direction, p: Position) =>
  reducePosition(p, positionalDirection(d))
