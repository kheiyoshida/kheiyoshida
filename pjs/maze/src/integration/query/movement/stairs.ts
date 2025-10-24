import { determineTerrainStyle, TerrainStyle } from '../structure/terrainStyle.ts'
import { maze } from '../../../game'

export type GoDownstairsAnimationType = 'descent' | 'lift' | 'proceed' | 'warp'

export type ProceedToNextFloorAnimationType = 'corridor' | 'still'

export type StairAnimation = {
  goDownstairs: GoDownstairsAnimationType
  proceedToNextFloor: ProceedToNextFloorAnimationType
}

export const getStairAnimation = (): StairAnimation => {
  const { prev, current, next } = maze.getStageContext()
  const prevStyle = prev ? determineTerrainStyle(prev.style) : null
  const currentStyle = determineTerrainStyle(current.style)
  const nextStyle = next ? determineTerrainStyle(next.style) : null

  return {
    goDownstairs: getGoDownstairsAnimationType(currentStyle, nextStyle),
    proceedToNextFloor: getProceedToNextFloorAnimationType(prevStyle, currentStyle),
  }
}

export const getGoDownstairsAnimationType = (
  current: TerrainStyle,
  next: TerrainStyle | null
): GoDownstairsAnimationType => {
  if (current !== next) return 'warp'
  if (current == 'default_') return 'descent'
  if (current == 'tiles') return 'lift'
  if (current == 'poles') return 'proceed'
  throw new Error(`uncaught combination: ${current} & ${next}`)
}

export const getProceedToNextFloorAnimationType = (
  prev: TerrainStyle | null,
  current: TerrainStyle
): ProceedToNextFloorAnimationType => {
  if (prev === current) return 'corridor'
  return 'still'
}
