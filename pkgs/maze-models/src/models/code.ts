export type ModelCode = ClassicModelCode | 'Warp' | 'Pole' | 'Tile' | 'StairTile' | 'BottomTile'

export type ClassicModelCode = 'Floor' | 'Ceil' | 'Wall' | 'StairCeil' | 'StairSteps'

export const isClassic = (code: ModelCode): code is ClassicModelCode =>
  code === 'Floor' || code === 'Ceil' || code === 'Wall' || code === 'StairCeil' || code === 'StairSteps'
