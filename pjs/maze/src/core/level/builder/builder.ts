import { MazeParams } from './index.ts'
import { MazeGrid } from '../grid.ts'

export class MazeBuilder {
  constructor(
    putCells: (grid: MazeGrid, fillRate: number, connRate: number) => void,
    setStair: (grid: MazeGrid) => void,
    setStart: (grid: MazeGrid) => void,
    adjustParams: (params: MazeParams) => MazeParams
  ) {
    this.putCells = putCells
    this.setStair = setStair
    this.setStart = setStart
    this.adjustParams = adjustParams
  }

  public static BuildRetryLimit = 20
  private readonly putCells: (grid: MazeGrid, fillRate: number, connRate: number) => void
  private readonly setStair: (grid: MazeGrid) => void
  private readonly setStart: (grid: MazeGrid) => void
  private readonly adjustParams: (params: MazeParams) => MazeParams

  build(params: MazeParams, retry = 0): MazeGrid {
    if (params.size % 2 === 0) throw new Error(`size must be odd number, but got ${params.size}`)
    const grid = new MazeGrid(params.size, params.size)
    this.putCells(grid, params.fillRate, params.connRate)
    try {
      this.setStair(grid)
      this.setStart(grid)
    } catch (e) {
      if (retry < MazeBuilder.BuildRetryLimit) return this.build(this.adjustParams(params), retry + 1)
      else throw Error(`could not build valid matrix`)
    }
    return grid
  }
}
