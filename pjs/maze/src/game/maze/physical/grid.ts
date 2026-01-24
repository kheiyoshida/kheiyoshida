import { Grid3D, VerticalGrid3DSlice } from '../../../core/grid/grid3d.ts'
import { MazeBlock } from './block.ts'
import { MazeGrid } from '../../../core/level/grid.ts'
import { Position2D } from '../../../core/grid/position2d.ts'
import { IWorldState } from '../../world/state.ts'
import { gridConverter } from './mapper'
import { StairType } from '../stair.ts'

export enum VerticalLayer {
  Up2 = 0,
  Up1 = 1,
  Middle = 2,
  Down1 = 3,
  Down2 = 4,
  Down3 = 5,
}

export class PhysicalMazeGrid extends Grid3D<MazeBlock> {
  /**
   * number of blocks to "surround" the original 2d grid,
   * so that the player won't see the outside
   */
  static readonly SurroundingBlocks = 5

  static readonly VerticalSliceSize = 6

  static convert(
    grid: MazeGrid,
    stairType: StairType,
    worldState: IWorldState
  ): PhysicalMazeGrid {
    return gridConverter(grid, { stairType, ...worldState })
  }

  getSliceByLogicalPosition(position: Position2D): VerticalGrid3DSlice<MazeBlock> {
    return this.getVerticalSlice({
      x: position.x + PhysicalMazeGrid.SurroundingBlocks,
      y: position.y + PhysicalMazeGrid.SurroundingBlocks,
    })
  }
}
