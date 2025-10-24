import { MazeGrid } from './grid.ts'
import { buildMazeGrid } from './builder'

export type MazeLevelParams = [size: number, fillRate: number, connRate: number]

export class MazeLevel {
  protected constructor(public readonly grid: MazeGrid) {}

  static build(params: MazeLevelParams): MazeLevel {
    return new MazeLevel(buildMazeGrid(params))
  }
}
