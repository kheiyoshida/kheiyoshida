import { Grid3D, Position3D } from '../../../../core/grid/grid3d.ts'
import { MazeBlock } from '../../../../game/maze/physical/block.ts'

export enum ViewX {
  Left2 = -2,
  Left1 = -1,
  Center = 0,
  Right1 = 1,
  Right2 = 2,
}

export enum ViewZ {
  L1 = 0, // origin
  L2 = 1,
  L3 = 2,
  L4 = 3,
  L5 = 4,
  L6 = 5, // the furthest
}

export enum ViewY {
  Up2 = 2,
  Up1 = 1,
  Middle = 0,
  Down1 = -1,
  Down2 = -2,
}

export const TotalViewX = 5
export const TotalViewZ = 6
export const TotalViewY = 5

export type ViewPosition = {
  x: ViewX
  y: ViewY
  z: ViewZ
}

export type ViewPos2D = Pick<ViewPosition, 'x' | 'z'>

export const toPosition3D = (viewPosition: ViewPosition): Position3D => ({
  x: 2 - viewPosition.x,
  y: viewPosition.z,
  z: 2 - viewPosition.y,
})

export const toViewPosition = (position3d: Position3D): ViewPosition => ({
  x: 2 - position3d.x,
  y: 2 - position3d.z,
  z: position3d.y,
})

export class MazeView {
  constructor(readonly grid: Grid3D<MazeBlock>) {}

  getBlock(viewPos: ViewPosition): MazeBlock {
    const gridPos = toPosition3D(viewPos)
    return this.grid.get(gridPos)!
  }

  setBlock(viewPos: ViewPosition, block: MazeBlock): void {
    const gridPos = toPosition3D(viewPos)
    this.grid.set(gridPos, block)
  }

  iterate(cb: (viewPos: ViewPosition, block: MazeBlock | null) => void): void {
    this.grid.iterate((block, gridPos) => {
      const viewPos = toViewPosition(gridPos)
      cb(viewPos, block)
    })
  }
}
