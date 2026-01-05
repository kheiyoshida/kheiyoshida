import { ModelClass, ModelUsage } from './entity'

export type ModelCode =
  | ClassicModelCode
  | TileModelCode
  | PoleModelCode
  | FloatingBoxModelCode
  | StackableBoxModelCode
  | 'Warp'

export type ClassicModelCode = 'Floor' | 'Ceil' | 'Wall' | 'StairCeil' | 'StairSteps'
export type TileModelCode = 'Tile' | 'StairTile' | 'BottomTile'
export type PoleModelCode = 'Pole1' | 'Pole2' | 'Pole3' | 'Pole4' | 'Pole5'
export type FloatingBoxModelCode = 'FloatingBox' | 'FloatingStairBox' | 'FloatingFloorBox'
export type StackableBoxModelCode = 'StackableBox' | 'StackableStairBox'

export const isPole = (code: ModelCode): code is PoleModelCode => code.includes('Pole')

export const isTile = (code: ModelCode): code is TileModelCode =>
  code === 'Tile' || code === 'StairTile' || code === 'BottomTile'

export const isClassic = (code: ModelCode): code is ClassicModelCode =>
  code === 'Floor' || code === 'Ceil' || code === 'Wall' || code === 'StairCeil' || code === 'StairSteps'

export const isStackableBox = (code: ModelCode): code is StackableBoxModelCode =>
  code === 'StackableBox' || code === 'StackableStairBox'
export const isFloatingBox = (code: ModelCode): code is FloatingBoxModelCode =>
  code === 'FloatingBox' || code === 'FloatingStairBox' || code === 'FloatingFloorBox'

type ConcreteCodeService = {
  getCode(usage: ModelUsage, length: number): ModelCode
}

export const concreteModelCodeService: Record<ModelClass, ConcreteCodeService> = {
  floatingBox: {
    getCode(usage: ModelUsage): ModelCode {
      if (usage == 'stair') return 'FloatingStairBox'
      return 'FloatingBox'
    },
  },
  pole: {
    getCode(usage: ModelUsage, length: number): ModelCode {
      if (usage === 'stair') return 'StackableStairBox'
      return `Pole${length}` as PoleModelCode
    },
  },
  stackedBox: {
    getCode(usage: ModelUsage): ModelCode {
      if (usage == 'stair') return 'StackableStairBox'
      return 'StackableBox'
    },
  },
  tile: {
    getCode(usage: ModelUsage): ModelCode {
      if (usage == 'stair') return 'StairTile'
      return 'Tile'
    },
  },
}
