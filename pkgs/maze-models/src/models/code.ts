export type ModelCode =
  | ClassicModelCode
  | TileModelCode
  | PoleModelCode
  | FloatingBoxModelCode
  | StackableBoxModelCode
  | 'Warp'

export type ClassicModelCode = 'Floor' | 'Ceil' | 'Wall' | 'StairCeil' | 'StairSteps'
export type TileModelCode = 'Tile' | 'StairTile' | 'BottomTile'
export type PoleModelCode = 'Pole'
export type FloatingBoxModelCode = 'FloatingBox' | 'FloatingStairBox' | 'FloatingFloorBox'
export type StackableBoxModelCode = 'StackableBox' | 'StackableStairBox'

export const isPole = (code: ModelCode): code is PoleModelCode => code === 'Pole'

export const isTile = (code: ModelCode): code is TileModelCode =>
  code === 'Tile' || code === 'StairTile' || code === 'BottomTile'

export const isClassic = (code: ModelCode): code is ClassicModelCode =>
  code === 'Floor' || code === 'Ceil' || code === 'Wall' || code === 'StairCeil' || code === 'StairSteps'

export const isStackableBox = (code: ModelCode): code is StackableBoxModelCode =>
  code === 'StackableBox' || code === 'StackableStairBox'
export const isFloatingBox = (code: ModelCode): code is FloatingBoxModelCode =>
  code === 'FloatingBox' || code === 'FloatingStairBox' || code === 'FloatingFloorBox'
