import { MazeGrid } from '../grid.ts'
import { setStairMethods, setStartMethods } from './extras.ts'
import { MazeBuilder } from './builder.ts'
import { putCellsWithExit, putCellsWithoutConstraints } from './put'

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
  const builder = new MazeBuilder(
    params.stairPositionConstraint === 'exit' ? putCellsWithExit : putCellsWithoutConstraints,
    setStairMethods[params.stairPositionConstraint],
    setStartMethods[params.startPositionConstraint],
    adjustParams
  )

  return builder.build(params)
}

const adjustParams = (params: MazeParams): MazeParams => {
  return {
    ...params,
    fillRate: Math.max(0.1, params.fillRate * 0.9),
    size: params.size,
  }
}
