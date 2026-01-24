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

export const rotated = (dir: Direction, perspectiveDir: Direction) => {
  const d = NESW.indexOf(dir)
  const p = NESW.indexOf(perspectiveDir)
  return NESW[(d - p + 4) % 4]
}
