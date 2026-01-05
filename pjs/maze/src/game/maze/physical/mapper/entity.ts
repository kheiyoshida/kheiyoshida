import { ModelCode } from 'maze-models'
import { concreteModelCodeService, ModelUsage } from './code.ts'
import { ModelClassEmitter } from './class.ts'
import { randomIntInclusiveBetween } from 'utils'

export type ModelClass = 'floatingBox' | 'stackedBox' | 'tile' | 'pole'
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

  get modelType(): ModelType {
    return modelTypeMap[this.modelClass]
  }

  public readonly verticalLength: number = 1

  constructor(modelClass: ModelClass, size: ModelSize, usage: ModelUsage = 'normal', length = 1) {
    this.modelClass = modelClass
    this.usage = usage
    this.verticalLength = length

    this.code = concreteModelCodeService[this.modelClass].getCode(this.usage, this.verticalLength)

    // TODO: set variant
  }

  public usage: ModelUsage

  public readonly code: ModelCode
}

type EntityOptions = {
  avoidModelType?: ModelType
  usage?: ModelUsage
  maxLength?: number
}

export class ModelEntityEmitter {
  private classEmitter: ModelClassEmitter

  constructor(
    private readonly density: number,
    gravity: number
  ) {
    this.classEmitter = ModelClassEmitter.build(density, gravity)
  }

  private shouldEmit(): boolean {
    return Math.random() < this.density
  }

  static defaultOptions: EntityOptions = {
    avoidModelType: undefined,
    usage: 'normal',
    maxLength: undefined,
  }

  emitNullable(
    { avoidModelType, maxLength, usage }: EntityOptions = ModelEntityEmitter.defaultOptions
  ): ModelEntity | null {
    if (!this.shouldEmit()) return null
    const modelClass = this.classEmitter.emitModelClass(avoidModelType)
    if (!modelClass) return null
    const length = modelClass === 'pole' && maxLength ? randomIntInclusiveBetween(1, maxLength) : 1
    const size = ModelSize.Large
    return new ModelEntity(modelClass, size, usage, length)
  }

  emitEnsured(
    { avoidModelType, maxLength, usage }: EntityOptions = ModelEntityEmitter.defaultOptions
  ): ModelEntity {
    const modelClass = this.classEmitter.emitModelClassEnsured(avoidModelType)
    const length = modelClass === 'pole' && maxLength ? randomIntInclusiveBetween(1, maxLength) : 1
    const size = ModelSize.Large
    return new ModelEntity(modelClass, size, usage, length)
  }
}
