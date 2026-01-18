import { ModelClassEmitter } from './class.ts'
import { randomIntInclusiveBetween } from 'utils'
import { ModelEntity, ModelSize, ModelType, ModelUsage } from 'maze-models'
import { IWorldState } from '../../../world/state.ts'

type EntityOptions = {
  avoidModelType?: ModelType
  usage?: ModelUsage
  maxLength?: number
}

const getSize = (density: number) => {
  if (density > 0.8) return ModelSize.Expand
  if (density > 0.5) return ModelSize.Large
  if (density > 0.3) return ModelSize.Medium
  return ModelSize.Small
}

export class ModelEntityEmitter {
  private classEmitter: ModelClassEmitter

  private readonly modelSize: ModelSize

  private readonly density: number

  constructor({ density, order, gravity, scale }: IWorldState) {
    this.classEmitter = ModelClassEmitter.build(order, gravity)
    this.modelSize = getSize(scale)
    this.density = density
  }

  private shouldEmit(): boolean {
    return Math.random() < this.density
  }

  static defaultOptions: EntityOptions = {
    avoidModelType: undefined,
    usage: 'fill',
    maxLength: undefined,
  }

  emitNullable(options: EntityOptions = ModelEntityEmitter.defaultOptions): ModelEntity | null {
    if (!this.shouldEmit()) return null
    return this.emitEnsured(options)
  }

  emitEnsured(
    { avoidModelType, maxLength, usage }: EntityOptions = ModelEntityEmitter.defaultOptions
  ): ModelEntity {
    const modelClass = this.classEmitter.emitModelClassEnsured(avoidModelType)
    const length = modelClass === 'pole' && maxLength ? randomIntInclusiveBetween(1, maxLength) : 1
    return new ModelEntity(modelClass, this.modelSize, usage, length)
  }
}
