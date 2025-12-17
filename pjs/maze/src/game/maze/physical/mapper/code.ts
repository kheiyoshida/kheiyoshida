import { ModelCode } from 'maze-models'
import { ModelClass } from './entity.ts'

export type ModelUsage = 'normal' | 'stair'

type ConcreteCodeService = {
  getCode(usage: ModelUsage): ModelCode
}

export const concreteModelCodeService: Record<ModelClass, ConcreteCodeService> = {
  floatingBox: {
    getCode(usage: ModelUsage): ModelCode {
      if (usage == 'stair') return 'FloatingStairBox'
      return 'FloatingBox'
    },
  },
  pole: {
    getCode(): ModelCode {
      return 'Pole'
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
