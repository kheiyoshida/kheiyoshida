import { Direction } from '../direction.ts'

export type Position2D = { x: number; y: number }

export const equals = (a: Position2D, b: Position2D): boolean => a.x === b.x && a.y === b.y

export const positionKey = (p: Position2D): string => `${p.x},${p.y}`

export const distance = (a: Position2D, b: Position2D): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

export const getAdjacent = (position: Position2D, direction: Direction): Position2D => {
  const disposition = getDisposition(direction, 1)
  return { x: position.x + disposition.x, y: position.y + disposition.y }
}

export const getPositionInDirection = (pos: Position2D, dir: Direction, distance: number): Position2D => {
  return sumPosition(pos, getDisposition(dir, distance))
}

export const sumPosition = (a: Position2D, b: Position2D): Position2D => {
  return { x: a.x + b.x, y: a.y + b.y }
}

export const isEven = (pos: Position2D): boolean => pos.x % 2 === 0 && pos.y % 2 === 0

/**
 * get the direction from a to b
 * @param a
 * @param b
 * @param pref preferred direction if horizontal and vertical distances are the same
 */
export const direction = (a: Position2D, b: Position2D, pref: 'ns' | 'ew' = 'ns'): Direction => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const absX = Math.abs(dx)
  const absY = Math.abs(dy)
  if (absX === 0 && absY === 0) throw Error(`Cannot calculate direction from same position`)

  if (absX > absY) return dx > 0 ? 'e' : 'w'
  else if (absX < absY) return dy > 0 ? 's' : 'n'
  else {
    if (pref === 'ns') return dy > 0 ? 's' : 'n'
    else return dx > 0 ? 'e' : 'w'
  }
}

export const getDisposition = (direction: Direction, distance: number): Position2D => {
  switch (direction) {
    case 'n':
      return { x: 0, y: -distance }
    case 'e':
      return { x: distance, y: 0 }
    case 's':
      return { x: 0, y: distance }
    case 'w':
      return { x: -distance, y: 0 }
  }
}

