import { ModelClass, ModelUsage } from './entity'

/**
 * logical code that represents the algorithm to generate geometries.
 * as long as the code is the same, the algorithm is the same (variant and size differ).
 */
export type ModelCode = TileModelCode | PoleModelCode | FloatingBoxModelCode | StackableBoxModelCode

export type StackableBoxModelCode = 'StackableBox' | 'StackableStairBox'
export type PoleModelCode = 'Pole1' | 'Pole2' | 'Pole3' | 'Pole4' | 'Pole5'
export type FloatingBoxModelCode = 'FloatingBox' | 'FloatingFloorBox'
export type TileModelCode = 'BlockingTile' | 'FloorTile'

type ConcreteCodeService = {
  getCode(usage: ModelUsage, length: number): ModelCode
}

export const concreteModelCodeService: Record<ModelClass, ConcreteCodeService> = {
  stackedBox: {
    getCode(usage: ModelUsage): ModelCode {
      if (usage == 'stair') return 'StackableStairBox'
      return 'StackableBox'
    },
  },
  pole: {
    getCode(usage: ModelUsage, length: number): ModelCode {
      if (usage === 'stair') return 'StackableStairBox'
      return `Pole${length}` as PoleModelCode
    },
  },
  floatingBox: {
    getCode(usage: ModelUsage): ModelCode {
      if (usage == 'fill') return 'FloatingBox'
      return 'FloatingFloorBox'
    },
  },
  tile: {
    getCode(usage: ModelUsage): ModelCode {
      if (usage == 'fill') return 'BlockingTile'
      return 'FloorTile'
    },
  },
}
