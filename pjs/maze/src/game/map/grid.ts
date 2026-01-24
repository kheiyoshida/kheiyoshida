import { Grid2D } from '../../core/grid/grid2d.ts'
import { MazeGrid } from '../../core/level/grid.ts'
import { Position2D } from '../../core/grid/position2d.ts'

type MapCell = {
  visited: boolean
  stair?: boolean
}

export class MapGrid extends Grid2D<MapCell> {
  constructor(mazeGrid: MazeGrid) {
    super(mazeGrid.sizeX, mazeGrid.sizeY)
    this.convertMazeGrid(mazeGrid)
  }

  private convertMazeGrid(mazeGrid: MazeGrid) {
    mazeGrid.iterateItems((cell, position) => {
      if (cell.type === 'stair') {
        this.set(position, { visited: false, stair: true })
      } else {
        this.set(position, { visited: false })
      }
    })
  }

  public visit(position: Position2D) {
    this.set(position, { ...this.get(position), visited: true })
  }
}
