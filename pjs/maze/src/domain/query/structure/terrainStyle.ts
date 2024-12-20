import { store } from '../../../store'
import { RenderingStyle } from '../../../store/stage.ts'

export const getTerrainRenderStyle = (): TerrainStyle => {
  const style = store.getStageContext().current.style
  return determineTerrainStyle(style)
}

export const determineTerrainStyle = (style: RenderingStyle): TerrainStyle => {
  if (style <= 3) return 'poles'
  if (style >= 7) return 'tiles'
  return 'default_'
}

export type TerrainStyle = 'default_' | 'poles' | 'tiles'
