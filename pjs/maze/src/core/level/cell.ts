import { Direction } from '../grid/direction.ts'

export type MazeCellType = 'floor' | 'stair'

export class MazeCell {
  constructor(public type: MazeCellType = 'floor') {}

  public start?: StartPositionMeta
}

export type StartPositionMeta = { direction: Direction }
