import { GridConverter } from './index.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { MazeBlock } from '../block.ts'
import { MazeObject } from '../object.ts'
import { getAdjacent, getPositionInDirection, Position2D } from '../../../../core/grid/position2d.ts'
import { getTurnedDirection } from '../../../../core/grid/direction.ts'

export const polesGridConverter: GridConverter = (grid, stairType) => {
  const physicalGrid = new PhysicalMazeGrid(
    grid.sizeX + PhysicalMazeGrid.SurroundingBlocks * 2,
    grid.sizeY + PhysicalMazeGrid.SurroundingBlocks * 2,
    PhysicalMazeGrid.VerticalSliceSize
  )

  // physicalGrid.grid2D.iterate((_, pos) => {
  //   if (
  //     pos.x === PhysicalMazeGrid.SurroundingBlocks - 1 ||
  //     pos.y === PhysicalMazeGrid.SurroundingBlocks - 1 ||
  //     pos.x === grid.sizeX + PhysicalMazeGrid.SurroundingBlocks ||
  //     pos.y === grid.sizeY + PhysicalMazeGrid.SurroundingBlocks
  //   ) {
  //     physicalGrid.set({ ...pos, z: VerticalLayer.Middle }, poleBlock())
  //   }
  // })
  //
  // let stairPos: Position2D | undefined = undefined
  // grid.iterate((item, pos) => {
  //   if (item === null) {
  //     physicalGrid.getSliceByLogicalPosition(pos).set(VerticalLayer.Middle, poleBlock())
  //   }
  //   if (item?.type === 'stair') {
  //     stairPos = pos
  //   }
  // })
  //
  // if (stairPos !== undefined) {
  //   if (stairType == 'normal') {
  //     // pathway to the next level
  //     const stairDir = grid.getDeadEndDirection(stairPos)
  //     const pathwayLength = 5
  //     for (let i = 1; i <= pathwayLength; i++) {
  //       const pathwayPos = getPositionInDirection(stairPos, stairDir, i)
  //       const leftPos = getAdjacent(pathwayPos, getTurnedDirection('left', stairDir))
  //       const rightPos = getAdjacent(pathwayPos, getTurnedDirection('right', stairDir))
  //       physicalGrid.getSliceByLogicalPosition(pathwayPos).set(VerticalLayer.Middle, new MazeBlock([]))
  //       physicalGrid.getSliceByLogicalPosition(leftPos).set(VerticalLayer.Middle, poleBlock())
  //       physicalGrid.getSliceByLogicalPosition(rightPos).set(VerticalLayer.Middle, poleBlock())
  //     }
  //   } else {
  //     physicalGrid
  //       .getSliceByLogicalPosition(stairPos)
  //       .set(VerticalLayer.Middle, new MazeBlock([new MazeObject('Warp')]))
  //   }
  // }

  return physicalGrid
}

const poleBlock = () => new MazeBlock([new MazeObject('Pole')])
