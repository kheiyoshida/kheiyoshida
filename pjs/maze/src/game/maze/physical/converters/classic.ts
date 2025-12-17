import { GridConverter } from './index.ts'
import { PhysicalMazeGrid, VerticalLayer } from '../grid.ts'
import { MazeBlock } from '../block.ts'
import { MazeObject } from '../object.ts'
import { Direction, getTurnedDirection, NESW } from '../../../../core/grid/direction.ts'
import { getAdjacent, getPositionInDirection } from '../../../../core/grid/position2d.ts'

export const classicGridConverter: GridConverter = (grid, stairType) => {
  const physicalGrid = new PhysicalMazeGrid(
    grid.sizeX + PhysicalMazeGrid.SurroundingBlocks * 2,
    grid.sizeY + PhysicalMazeGrid.SurroundingBlocks * 2,
    PhysicalMazeGrid.VerticalSliceSize
  )

  // // surrounding
  // physicalGrid.grid2D.iterate((block, pos) => {
  //   if (
  //     pos.x === PhysicalMazeGrid.SurroundingBlocks - 1 ||
  //     pos.y === PhysicalMazeGrid.SurroundingBlocks - 1 ||
  //     pos.x === grid.sizeX + PhysicalMazeGrid.SurroundingBlocks ||
  //     pos.y === grid.sizeY + PhysicalMazeGrid.SurroundingBlocks
  //   ) {
  //     physicalGrid.set({ ...pos, z: VerticalLayer.Middle }, wallBlock())
  //   }
  // })
  //
  // grid.iterate((cell, pos2d) => {
  //   if (cell === null) {
  //     physicalGrid.getSliceByLogicalPosition(pos2d).set(VerticalLayer.Middle, wallBlock())
  //   } else if (cell.type === 'floor') {
  //     physicalGrid.getSliceByLogicalPosition(pos2d).set(VerticalLayer.Middle, floorBlock())
  //   } else if (cell.type === 'stair') {
  //     if (stairType === 'normal') {
  //       const stairDir = grid.getDeadEndDirection(pos2d)
  //       const { middle, down1 } = stairBlocks(stairDir)
  //       physicalGrid.getSliceByLogicalPosition(pos2d).set(VerticalLayer.Middle, middle)
  //       physicalGrid.getSliceByLogicalPosition(pos2d).set(VerticalLayer.Down1, down1)
  //
  //       const stairLeft = getAdjacent(pos2d, getTurnedDirection('left', stairDir))
  //       const stairRight = getAdjacent(pos2d, getTurnedDirection('right', stairDir))
  //       physicalGrid.getSliceByLogicalPosition(stairLeft).set(VerticalLayer.Down1, stairWallLeft(stairDir))
  //       physicalGrid.getSliceByLogicalPosition(stairRight).set(VerticalLayer.Down1, stairWallRight(stairDir))
  //
  //       // corridor
  //       const corridorLength = 4
  //       for (let i = 1; i <= corridorLength; i++) {
  //         const corridorPos = getPositionInDirection(pos2d, stairDir, i)
  //         const corridorLeft = getAdjacent(corridorPos, getTurnedDirection('left', stairDir))
  //         const corridorRight = getAdjacent(corridorPos, getTurnedDirection('right', stairDir))
  //         physicalGrid.getSliceByLogicalPosition(corridorPos).set(VerticalLayer.Down1, floorBlock())
  //         physicalGrid
  //           .getSliceByLogicalPosition(corridorLeft)
  //           .set(VerticalLayer.Down1, stairWallLeft(stairDir))
  //         physicalGrid
  //           .getSliceByLogicalPosition(corridorRight)
  //           .set(VerticalLayer.Down1, stairWallRight(stairDir))
  //       }
  //     } else {
  //       physicalGrid.getSliceByLogicalPosition(pos2d).set(VerticalLayer.Middle, warpStairBlock())
  //     }
  //   }
  // })

  return physicalGrid
}

const wallBlock = () => new MazeBlock(NESW.map((d) => new MazeObject('Wall', d)))
const floorBlock = () => new MazeBlock([new MazeObject('Floor'), new MazeObject('Ceil')])
const warpStairBlock = () =>
  new MazeBlock([new MazeObject('Floor'), new MazeObject('Ceil'), new MazeObject('Warp')])

const stairBlocks = (dir: Direction) => {
  return {
    middle: new MazeBlock([new MazeObject('StairCeil', dir)]),
    down1: new MazeBlock([new MazeObject('StairSteps', dir)]),
  }
}
const stairWallLeft = (stairDir: Direction) =>
  new MazeBlock([new MazeObject('Wall', getTurnedDirection('right', stairDir))])
const stairWallRight = (stairDir: Direction) =>
  new MazeBlock([new MazeObject('Wall', getTurnedDirection('left', stairDir))])
