export type Scenes = 'silent' | 'neutral' | 'loud' | 'common'
export type Thresholds = 1 | 2 | 3
type Handler = (roomVar: number) => void

export type CommandGrid = {
  [T in Thresholds]: {
    [S in Scenes]: Handler
  }
}
