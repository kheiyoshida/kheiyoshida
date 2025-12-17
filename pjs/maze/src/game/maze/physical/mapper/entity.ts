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

  getModelCode(usage: ModelUsage): ModelCode {
    return concreteModelCodeService[this.modelClass].getCode(usage)
  }
}

export class ModelEntityEmitter {
  private classEmitter: ModelClassEmitter
  constructor(density: number, gravity: number) {
    this.classEmitter = ModelClassEmitter.build(density, gravity)
  }

  emit(avoidModelType?: ModelType, maxLength?: number): ModelEntity | null {
    const modelClass = this.classEmitter.emitModelClass(avoidModelType)
    if (!modelClass) return null
    const length = maxLength ? randomIntInclusiveBetween(1, maxLength) : 1
    return new ModelEntity(modelClass, length)
  }
}
