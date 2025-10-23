
export type MazeLevelParams = [size: number, fillRate: number, connRate: number]

export class MazeLevel {
  static build(params: MazeLevelParams): MazeLevel {
    return new MazeLevel()
  }
}
