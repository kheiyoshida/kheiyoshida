import { concreteModelCodeService, ModelCode } from './code'
import { randomIntInclusiveBetween } from 'utils'

export type ModelClass = 'floatingBox' | 'stackedBox' | 'tile' | 'pole'
export type ModelUsage = 'fill' | 'floor' | 'stair'
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

export type GeometryId = `${ModelCode}_${ModelSize}_${number}`

export class ModelEntity {
  public modelClass: ModelClass
  public readonly verticalLength: number = 1
  public readonly usage: ModelUsage
  public size: ModelSize
  public variant: number = 0

  get modelType(): ModelType {
    return modelTypeMap[this.modelClass]
  }

  constructor(modelClass: ModelClass, size: ModelSize, usage: ModelUsage = 'fill', length = 1) {
    this.modelClass = modelClass
    this.usage = usage
    this.verticalLength = length
    this.size = size

    this.code = concreteModelCodeService[this.modelClass].getCode(this.usage, this.verticalLength)

    this.variant = randomIntInclusiveBetween(ModelEntity.variantRange.min, ModelEntity.variantRange.max)
  }

  static variantRange = { min: 1, max: 3 }

  public readonly code: ModelCode

  public get id(): GeometryId {
    return `${this.code}_${this.size}_${this.variant}`
  }
}
