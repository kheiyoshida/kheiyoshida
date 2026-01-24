import { game } from '../../../game'
import { getStairSpec, StairType } from '../../../game/maze/stair.ts'

export type GoDownstairsAnimationType = StairType

export type StairAnimation = {
  goDownstairs: GoDownstairsAnimationType
}

export const getStairAnimation = (): StairAnimation => {
  const { type } = getStairSpec(game.maze.structureContext)
  return {
    goDownstairs: type,
  }
}
