import { store } from '../../../store'

export const getTerrainRenderStyle = (): TerrainRenderStyle => {
  const style = store.getStage().current.style
  if (style <= 3) return 'poles'
  if (style >= 7) return 'tiles'
  return 'default_'
}

export type TerrainRenderStyle = 'default_' | 'poles' | 'tiles'
