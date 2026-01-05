import { concreteModelCodeService, ModelCode } from './code'

export type ModelClass = 'floatingBox' | 'stackedBox' | 'tile' | 'pole'
export type ModelUsage = 'normal' | 'stair'
export type ModelType = 'floating' | 'stacked'

export const modelTypeMap: Record<ModelClass, ModelType> = {
  floatingBox: 'floating',
  tile: 'floating',
  stackedBox: 'stacked',
  pole: 'stacked',
}

export enum ModelSize {
  Small = 0,
  Medium = 1,
  Large = 2,
  Expand = 3,
}

export class ModelEntity {
  public modelClass: ModelClass
  public readonly verticalLength: number = 1
  public readonly usage: ModelUsage

  get modelType(): ModelType {
    return modelTypeMap[this.modelClass]
  }

  constructor(modelClass: ModelClass, size: ModelSize, usage: ModelUsage = 'normal', length = 1) {
    this.modelClass = modelClass
    this.usage = usage
    this.verticalLength = length

    this.code = concreteModelCodeService[this.modelClass].getCode(this.usage, this.verticalLength)

    // TODO: set variant
  }

  public readonly code: ModelCode
}
