import { Position, reducePosition } from './position'

export type LR = 'left' | 'right'
export type LRO = LR | 'opposite'

export type Direction = 'n' | 'e' | 's' | 'w'

export const NESW = ['n', 'e', 's', 'w'] as const

export const getTurnedDirection = (lro: LRO, currentDirection: Direction) => {
  const i = NESW.indexOf(currentDirection)
  switch (lro) {
    case 'right':
      return NESW[(i + 1) % 4]
    case 'left':
      return NESW[(i + 3) % 4]
    case 'opposite':
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
