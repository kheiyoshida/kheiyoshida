import { ModelCode } from 'maze-models'
import { Direction, NESW } from '../../../core/grid/direction.ts'
import { getVariant, ModelId } from './models.ts'
import { ModelEntity } from './mapper/entity.ts'

export type IMazeObject = {
  readonly model: ModelId
  readonly direction: Direction
}

export class MazeObject implements IMazeObject {
  public readonly model: ModelId
  public readonly direction: Direction

  public readonly entity?: ModelEntity

  constructor(
    modelIdOrCode: ModelId | ModelCode | ModelEntity,
    direction?: Direction // leave undefined when it doesn't care
  ) {
    this.direction = direction ?? NESW[Math.floor(Math.random() * 4)]

    if (typeof modelIdOrCode === 'string') {
      this.model = { code: modelIdOrCode, variant: getVariant(modelIdOrCode) }
    } else if (modelIdOrCode instanceof ModelEntity) {
      this.entity = modelIdOrCode
      this.model = {
        code: modelIdOrCode.getModelCode(),
      }
    } else {
      this.model = modelIdOrCode
    }
  }
}
