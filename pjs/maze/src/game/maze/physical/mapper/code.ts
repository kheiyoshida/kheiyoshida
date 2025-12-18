import { ModelCode } from 'maze-models'
import { ModelClass } from './entity.ts'
import { PoleModelCode } from 'maze-models/src/models/code.ts'

export type ModelUsage = 'normal' | 'stair'

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
