export type MazeCellType = 'floor' | 'stair'

export class MazeCell {
  constructor(public type: MazeCellType = 'floor') {}
}
