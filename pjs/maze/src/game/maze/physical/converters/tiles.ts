import { GridConverter } from './index.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { MazeBlock } from '../block.ts'
import { MazeObject } from '../object.ts'
import { getPositionInDirection } from '../../../../core/grid/position2d.ts'

export const tilesGridConverter: GridConverter = (grid) => {
  const physicalGrid = new PhysicalMazeGrid(
    grid.sizeX + PhysicalMazeGrid.SurroundingBlocks * 2,
    grid.sizeY + PhysicalMazeGrid.SurroundingBlocks * 2,
    PhysicalMazeGrid.VerticalSliceSize
  )

  grid.iterate((item, pos) => {
    if (item?.type === 'floor') {
      physicalGrid
        .getSliceByLogicalPosition(pos)
        .set(VerticalLayer.Down1, new MazeBlock([new MazeObject({ code: 'Tile' })]))
    }
    if (item?.type === 'stair') {
      physicalGrid
        .getSliceByLogicalPosition(pos)
        .set(VerticalLayer.Down1, new MazeBlock([new MazeObject({ code: 'StairTile' })]))

      const stairDir = grid.getDeadEndDirection(pos)
      const corridorLength = 4
      for (let i = 1; i <= corridorLength; i++) {
        const corridorPos = getPositionInDirection(pos, stairDir, i)
        physicalGrid
          .getSliceByLogicalPosition(corridorPos)
          .set(VerticalLayer.Down2, new MazeBlock([new MazeObject({ code: 'BottomTile' })]))
      }
    }
  })

  return physicalGrid
}
