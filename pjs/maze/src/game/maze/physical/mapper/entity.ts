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

export class ModelEntity {
  public modelClass: ModelClass

  get modelType(): ModelType {
    return modelTypeMap[this.modelClass]
  }

  public readonly verticalLength: number = 1

  constructor(modelClass: ModelClass, length = 1) {
    this.modelClass = modelClass
    this.verticalLength = length
  }

  getModelCode(usage: ModelUsage = 'normal'): ModelCode {
    return concreteModelCodeService[this.modelClass].getCode(usage, this.verticalLength)
  }
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

  emitNullable(avoidModelType?: ModelType, maxLength?: number, ensure = false): ModelEntity | null {
    if (!ensure && !this.shouldEmit()) return null
    const modelClass = this.classEmitter.emitModelClass(avoidModelType)
    if (!modelClass) return null
    const length = modelClass === 'pole' && maxLength ? randomIntInclusiveBetween(1, maxLength) : 1
    return new ModelEntity(modelClass, length)
  }

  emitEnsured(avoidModelType?: ModelType, maxLength?: number, retry = 0): ModelEntity {
    if (retry > 100) {
      throw new Error(
        `Retry of model class ensured. avoidModelType=${avoidModelType}, maxLength=${maxLength} ${
          (this.classEmitter as any).thresholds
        }`
      )
    }
    const cls = this.emitNullable(avoidModelType, maxLength, true)
    if (cls != null) return cls

    return this.emitEnsured(avoidModelType, maxLength, retry + 1)
  }
}
