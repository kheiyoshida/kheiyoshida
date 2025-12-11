import { MazeGrid } from '../grid.ts'
import { seedCells } from './put/seed.ts'
import { connectCells } from './put/connect.ts'
import { setStairMethods, setStartMethods } from './extras.ts'
import { MazeBuilder } from './builder.ts'

export type MazeParams = {
  size: number
  fillRate: number
  connRate: number
}

export type BuildMazeGridParams = MazeParams & {
  stairPositionConstraint: StairPositionConstraint
  startPositionConstraint: StartPositionConstraint
}

export type StairPositionConstraint = 'deadEnd' | 'exit'
export type StartPositionConstraint = 'evenPositionCellExceptStair' | 'shouldFaceCorridorWall'

export const buildMazeGrid = (params: BuildMazeGridParams): MazeGrid => {
  const putCells = (grid: MazeGrid, fillRate: number, connRate: number) => {
    seedCells(grid, fillRate)
    connectCells(grid, connRate)
  }

  const builder = new MazeBuilder(
    putCells,
    setStairMethods[params.stairPositionConstraint],
    setStartMethods[params.startPositionConstraint],
    adjustParams
  )

  return builder.build(params)
}

const adjustParams = (params: MazeParams): MazeParams => {
  return {
    ...params,
    size: params.size + 2, // TODO: level gets too big
  }
}
