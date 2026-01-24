import { MazeGrid } from '../../../../core/level/grid'
import { PhysicalMazeGrid } from '../grid'
import { SliceMapper } from './slice.ts'
import { Position2D } from '../../../../core/grid/position2d.ts'
import { StairType } from '../../stair.ts'
import { StairMapper } from './stair.ts'
import { IWorldState } from '../../../world/state.ts'

export type PhysicalGridParams = IWorldState & {
  stairType: StairType
}

export const gridConverter = (grid: MazeGrid, params: PhysicalGridParams) => {
  const sliceMapper = new SliceMapper(params)
  const stairMapper = new StairMapper(params)

  const physicalGrid = new PhysicalMazeGrid(
    grid.sizeX + PhysicalMazeGrid.SurroundingBlocks * 2,
    grid.sizeY + PhysicalMazeGrid.SurroundingBlocks * 2,
    PhysicalMazeGrid.VerticalSliceSize
  )

  // surrounding
  physicalGrid.grid2D.iterate((block, pos) => {
    if (
      pos.x === PhysicalMazeGrid.SurroundingBlocks - 1 ||
      pos.y === PhysicalMazeGrid.SurroundingBlocks - 1 ||
      pos.x === grid.sizeX + PhysicalMazeGrid.SurroundingBlocks ||
      pos.y === grid.sizeY + PhysicalMazeGrid.SurroundingBlocks
    ) {
      const slice = physicalGrid.getVerticalSlice(pos)
      sliceMapper.map(slice, 'nullSlice')
    }
  })

  let stairPos: Position2D | undefined = undefined

  grid.iterate((cell, pos2d) => {
    if (cell === null) {
      const slice = physicalGrid.getSliceByLogicalPosition(pos2d)
      sliceMapper.map(slice, 'nullSlice')
    } else if (cell.type === 'floor') {
      const slice = physicalGrid.getSliceByLogicalPosition(pos2d)
      sliceMapper.map(slice, 'floorSlice')
    } else if (cell.type === 'stair') {
      stairPos = pos2d
    }
  })

  if (stairPos !== undefined) {
    const dir = grid.getDeadEndDirection(stairPos)
    stairMapper.mapStairSlices(physicalGrid, stairPos, dir)
  }

  return physicalGrid
}
