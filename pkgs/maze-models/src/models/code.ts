import { ModelClass, ModelUsage } from './entity'

/**
 * logical code that represents the algorithm to generate geometries.
 * as long as the code is the same, the algorithm is the same (variant and size differ).
 */
export type ModelCode = TileModelCode | PoleModelCode | FloatingBoxModelCode | StackableBoxModelCode

export type TileModelCode = 'Tile' | 'StairTile' | 'FloorTile'
export type PoleModelCode = 'Pole1' | 'Pole2' | 'Pole3' | 'Pole4' | 'Pole5'
export type FloatingBoxModelCode = 'FloatingBox' | 'FloatingStairBox' | 'FloatingFloorBox'
export type StackableBoxModelCode = 'StackableBox' | 'StackableStairBox'

type ConcreteCodeService = {
  getCode(usage: ModelUsage, length: number): ModelCode
}

export const concreteModelCodeService: Record<ModelClass, ConcreteCodeService> = {
  floatingBox: {
    getCode(usage: ModelUsage): ModelCode {
      if (usage == 'stair') return 'FloatingStairBox'
      // TODO: differentiate between floor and object
      return 'FloatingFloorBox'
      // return 'FloatingBox'
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
      return 'FloorTile'
    },
  },
}
