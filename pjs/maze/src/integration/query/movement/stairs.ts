import { game } from '../../../game'
import { Structure } from '../../../game/world'

export type GoDownstairsAnimationType = 'descent' | 'lift' | 'proceed' | 'warp'

export type ProceedToNextFloorAnimationType = 'corridor' | 'still'

export type StairAnimation = {
  goDownstairs: GoDownstairsAnimationType
  proceedToNextFloor: ProceedToNextFloorAnimationType
}

export const getStairAnimation = (): StairAnimation => {
  const { prev, current, next } = game.maze.structureContext

  return {
    goDownstairs: getGoDownstairsAnimationType(current, next),
    proceedToNextFloor: getProceedToNextFloorAnimationType(prev, current),
  }
}

export const getGoDownstairsAnimationType = (
  current: Structure,
  next: Structure | undefined
): GoDownstairsAnimationType => {
  if (current !== next) return 'warp'
  if (current == 'classic') return 'descent'
  if (current == 'tiles') return 'lift'
  if (current == 'poles') return 'proceed'
  return 'warp'
  // throw new Error(`uncaught combination: ${current} & ${next}`)
}

export const getProceedToNextFloorAnimationType = (
  prev: Structure | undefined,
  current: Structure
): ProceedToNextFloorAnimationType => {
  if (prev === current) return 'corridor'
  return 'still'
}
