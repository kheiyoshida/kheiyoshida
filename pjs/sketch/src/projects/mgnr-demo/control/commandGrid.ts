export type Scenes = 'silent' | 'neutral' | 'loud' | 'common'
export type Thresholds = 1 | 2 | 3 | 4 | 5
type Handler = (roomVar: number) => void

export type CommandGrid = {
  [S in Scenes]: {
    [T in Thresholds]: Handler
  }
}

export type PartialCommandGrid = {
  [S in Scenes]?: {
    [T in Thresholds]?: Handler
  }
}

const filler: CommandGrid[Scenes] = {
  1: () => undefined,
  2: () => undefined,
  3: () => undefined,
  4: () => undefined,
  5: () => undefined
}

export const buildCommandGrid = (partialGrid: PartialCommandGrid): CommandGrid => ({
  silent: {
    ...filler,
    ...partialGrid.silent,
  },
  loud: {
    ...filler,
    ...partialGrid.loud,
  },
  common: {
    ...filler,
    ...partialGrid.common,
  },
  neutral: {
    ...filler,
    ...partialGrid.neutral,
  },
})
