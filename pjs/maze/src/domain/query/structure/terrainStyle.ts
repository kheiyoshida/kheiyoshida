import { store } from '../../../store'

export const getTerrainRenderStyle = (): TerrainRenderStyle => {
  if (store.current.aesthetics <= 3) return 'poles'
  if (store.current.aesthetics >= 7) return 'tiles'
  return 'default_'
}

export type TerrainRenderStyle = 'default_' | 'poles' | 'tiles'
