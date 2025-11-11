export type ModelCode = ClassicModelCode | 'Octahedron' | 'Pole' | 'Tile' | 'StairTile'

export type ClassicModelCode = 'Floor' | 'Ceil' | 'Wall' | 'StairCeil' | 'StairSteps'

export const isClassic = (code: ModelCode): code is ClassicModelCode =>
  code === 'Floor' || code === 'Ceil' || code === 'Wall' || code === 'StairCeil' || code === 'StairSteps'
