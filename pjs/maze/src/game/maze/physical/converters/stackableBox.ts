import { GridConverter } from './index.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { VerticalGrid3DSlice } from '../../../../core/grid/grid3d.ts'
import { MazeBlock } from '../block.ts'
import { MazeObject } from '../object.ts'
import { fireByRate } from 'utils'
import { getPositionInDirection, Position2D } from '../../../../core/grid/position2d.ts'
import { option } from 'syncpack/dist/option'

export const stackableBoxConverter: GridConverter = (grid, stairType) => {
  const physicalGrid = new PhysicalMazeGrid(
    grid.sizeX + PhysicalMazeGrid.SurroundingBlocks * 2,
    grid.sizeY + PhysicalMazeGrid.SurroundingBlocks * 2,
    PhysicalMazeGrid.VerticalSliceSize
  )

  const optional = () => fireByRate(0.5)

  // surrounding
  physicalGrid.grid2D.iterate((slice, pos) => {
    if (
      pos.x === PhysicalMazeGrid.SurroundingBlocks - 1 ||
      pos.y === PhysicalMazeGrid.SurroundingBlocks - 1 ||
      pos.x === grid.sizeX + PhysicalMazeGrid.SurroundingBlocks ||
      pos.y === grid.sizeY + PhysicalMazeGrid.SurroundingBlocks
    ) {
      applyWallSlice(slice!, optional)
    }
  })

  let stairPos: Position2D | undefined = undefined
  grid.iterate((item, pos) => {
    if (item === null) {
      applyWallSlice(physicalGrid.getSliceByLogicalPosition(pos), optional)
    }
    if (item?.type === 'floor') {
      const slice = physicalGrid.getSliceByLogicalPosition(pos)
      slice.set(VerticalLayer.Down1, new MazeBlock([new MazeObject('StackableBox')]))
      slice.set(VerticalLayer.Down2, new MazeBlock([new MazeObject('StackableBox')]))
    }
    if (item?.type === 'stair') {
      stairPos = pos
    }
  })

  // stair
  if (stairPos !== undefined) {
    if (stairType === 'normal') {
      const stairDir = grid.getDeadEndDirection(stairPos)

      physicalGrid
        .getSliceByLogicalPosition(stairPos)
        .set(VerticalLayer.Down1, new MazeBlock([new MazeObject('StackableStairBox', stairDir)]))
      physicalGrid
        .getSliceByLogicalPosition(stairPos)
        .set(VerticalLayer.Down2, new MazeBlock([new MazeObject('StackableBox')]))

      // corridor
      const corridorLength = 4
      for (let i = 1; i <= corridorLength; i++) {
        const corridorPos = getPositionInDirection(stairPos, stairDir, i)
        physicalGrid.getSliceByLogicalPosition(corridorPos).set(VerticalLayer.Down1, new MazeBlock([]))
        physicalGrid
          .getSliceByLogicalPosition(corridorPos)
          .set(VerticalLayer.Down2, new MazeBlock([new MazeObject('StackableBox')]))
      }
    } else {
      physicalGrid
        .getSliceByLogicalPosition(stairPos)
        .set(VerticalLayer.Middle, new MazeBlock([new MazeObject('Warp')]))
      physicalGrid
        .getSliceByLogicalPosition(stairPos)
        .set(VerticalLayer.Down1, new MazeBlock([new MazeObject('StackableBox')]))
    }
  }

  return physicalGrid
}

const applyWallSlice = (slice: VerticalGrid3DSlice<MazeBlock>, optional: () => boolean) => {
  const shouldBlockByBoxes = optional()
  if (shouldBlockByBoxes) {
    slice.set(VerticalLayer.Down2, new MazeBlock([new MazeObject('StackableBox')]))
    slice.set(VerticalLayer.Down1, new MazeBlock([new MazeObject('StackableBox')]))
    slice.set(VerticalLayer.Middle, new MazeBlock([new MazeObject('StackableBox')]))
    if (optional()) {
      slice.set(VerticalLayer.Up1, new MazeBlock([new MazeObject('StackableBox')]))
      if (optional()) slice.set(VerticalLayer.Up2, new MazeBlock([new MazeObject('StackableBox')]))
    }
  } else {
    if (optional()) slice.set(VerticalLayer.Down2, new MazeBlock([new MazeObject('StackableBox')]))
  }
}
