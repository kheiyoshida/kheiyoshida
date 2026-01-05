import { ModelClassEmitter } from './class.ts'
import { randomIntInclusiveBetween } from 'utils'
import { ModelEntity, ModelSize, ModelType, ModelUsage } from 'maze-models'

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
