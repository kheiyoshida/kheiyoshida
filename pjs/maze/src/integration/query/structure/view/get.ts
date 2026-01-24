import { getDisposition, Position2D, sumPosition } from '../../../../core/grid/position2d.ts'
import { Direction, getTurnedDirection } from '../../../../core/grid/direction.ts'
import { PhysicalMazeGrid } from '../../../../game/maze/physical/grid.ts'
import { MazeView, ViewPos2D, ViewX, ViewY, ViewZ } from './view.ts'
import { Grid3D } from '../../../../core/grid/grid3d.ts'
import { MazeBlock } from '../../../../game/maze/physical/block.ts'

export type ViewOrigin = {
  position: Position2D
  direction: Direction
}

export const buildViewGrid = (mazeGrid: PhysicalMazeGrid, origin: ViewOrigin): MazeView => {
  const viewGrid = new Grid3D<MazeBlock>(5, 6, 6)
  const view = new MazeView(viewGrid)
  for (const [viewPos2d, gridPosition] of iterateRelative2dViewPositions(origin)) {
    const slice = mazeGrid.getSliceByLogicalPosition(gridPosition)
    for (let y = ViewY.Down3; y <= ViewY.Up2; y++) {
      const block = slice.get(2 - y)
      if (block) view.setBlock({ ...viewPos2d, y }, block.rotated(origin.direction))
    }
  }
  return view
}

export function* iterateRelative2dViewPositions(
  origin: ViewOrigin
): Generator<[ViewPos2D, Position2D]> {
  for (let h = ViewX.Left2; h <= ViewX.Right2; h++) {
    for (let v = ViewZ.L1; v <= ViewZ.L6; v++) {
      const horizontal = getDisposition(getTurnedDirection('right', origin.direction), h)
      const vertical = getDisposition(origin.direction, v)
      yield [
        {
          x: h,
          z: v,
        },
        sumPosition(sumPosition(origin.position, horizontal), vertical),
      ]
    }
  }
}
