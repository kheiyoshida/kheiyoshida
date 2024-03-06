import { Position, reducePosition } from '../../utils/position'

export type Direction = 'n' | 'e' | 's' | 'w'

export const NESW = ['n', 'e', 's', 'w'] as const

export const compass = (d: 'r' | 'l' | 'o', currentDirection: Direction) => {
  const i = NESW.indexOf(currentDirection)
  switch (d) {
    case 'r':
      return NESW[(i + 1) % 4]
    case 'l':
      return NESW[(i + 3) % 4]
    case 'o':
      return NESW[(i + 2) % 4]
  }
}

/**
 * @returns positional diff for the specified direction
 */
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
