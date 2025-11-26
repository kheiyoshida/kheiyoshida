import { GridConverter } from './index.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { MazeBlock } from '../block.ts'
import { MazeObject } from '../object.ts'
import { fireByRate } from 'utils'
import { Position2D } from '../../../../core/grid/position2d.ts'
import { VerticalGrid3DSlice } from '../../../../core/grid/grid3d.ts'

export const floatingBoxConverter: GridConverter = (grid, stairType) => {
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
      const slice = physicalGrid.getSliceByLogicalPosition(pos)
      applyWallSlice(slice, optional)
    }
    if (item?.type === 'floor') {
      const slice = physicalGrid.getSliceByLogicalPosition(pos)
      slice.set(VerticalLayer.Down1, boxBlock())
      if (optional()) slice.set(VerticalLayer.Up2, boxBlock())
      if (optional()) slice.set(VerticalLayer.Up1, boxBlock())
      if (optional()) slice.set(VerticalLayer.Down2, boxBlock())
    }
    if (item?.type === 'stair') {
      stairPos = pos
    }
  })

  // handle stair
  if (stairPos !== undefined) {
    const stairSlice = physicalGrid.getSliceByLogicalPosition(stairPos)
    stairSlice.set(VerticalLayer.Middle, new MazeBlock([new MazeObject('Warp')]))
    stairSlice.set(VerticalLayer.Down1, boxBlock())
  }

  return physicalGrid
}

const applyWallSlice = (slice: VerticalGrid3DSlice<MazeBlock>, optional: () => boolean):void => {
  const blockByEmptySpace = optional()
  if (blockByEmptySpace) {
    if (optional()) slice.set(VerticalLayer.Up2, boxBlock())
    if (optional()) slice.set(VerticalLayer.Up1, boxBlock())
    if (optional()) slice.set(VerticalLayer.Down2, boxBlock())
  } else {
    slice.set(VerticalLayer.Middle, boxBlock())
    if (optional()) slice.set(VerticalLayer.Up2, boxBlock())
    if (optional()) slice.set(VerticalLayer.Up1, boxBlock())
    if (optional()) slice.set(VerticalLayer.Down1, boxBlock())
    if (optional()) slice.set(VerticalLayer.Down2, boxBlock())
  }
}

const boxBlock = () => new MazeBlock([new MazeObject('FloatingBox')])
