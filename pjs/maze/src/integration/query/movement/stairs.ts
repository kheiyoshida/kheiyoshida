
import { game } from '../../../game'
import { determineModelingStyle, Structure } from '../../../game/world'

export type GoDownstairsAnimationType = 'descent' | 'lift' | 'proceed' | 'warp'

export type ProceedToNextFloorAnimationType = 'corridor' | 'still'

export type StairAnimation = {
  goDownstairs: GoDownstairsAnimationType
  proceedToNextFloor: ProceedToNextFloorAnimationType
}

export const getStairAnimation = (): StairAnimation => {
  const { prev, current, next } = game.maze.stageContext
  const prevStyle = prev ? determineModelingStyle(prev.style) : null
  const currentStyle = determineModelingStyle(current.style)
  const nextStyle = next ? determineModelingStyle(next.style) : null

  return {
    goDownstairs: getGoDownstairsAnimationType(currentStyle, nextStyle),
    proceedToNextFloor: getProceedToNextFloorAnimationType(prevStyle, currentStyle),
  }
}

export const getGoDownstairsAnimationType = (
  current: Structure,
  next: Structure | null
): GoDownstairsAnimationType => {
  if (current !== next) return 'warp'
  if (current == 'classic') return 'descent'
  if (current == 'tiles') return 'lift'
  if (current == 'poles') return 'proceed'
  throw new Error(`uncaught combination: ${current} & ${next}`)
}

export const getProceedToNextFloorAnimationType = (
  prev: Structure | null,
  current: Structure
): ProceedToNextFloorAnimationType => {
  if (prev === current) return 'corridor'
  return 'still'
}
