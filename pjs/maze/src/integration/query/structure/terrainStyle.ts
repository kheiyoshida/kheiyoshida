import { RenderingStyle } from '../../../game/stage/style.ts'
import { maze } from '../../../game'

export const getTerrainRenderStyle = (): TerrainStyle => {
  const style = maze.getStageContext().current.style
  return determineTerrainStyle(style)
}

export const determineTerrainStyle = (style: RenderingStyle): TerrainStyle => {
  if (style <= 3) return 'poles'
  if (style >= 7) return 'tiles'
  return 'default_'
}

export type TerrainStyle = 'default_' | 'poles' | 'tiles'
