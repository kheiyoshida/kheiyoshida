import { ModelCode } from 'maze-models'
import { Direction, NESW } from '../../../core/grid/direction.ts'
import { getVariant, ModelId } from './models.ts'
import { ModelEntity } from './mapper/entity.ts'
import { ModelUsage } from './mapper/code.ts'

export type IMazeObject = {
  readonly model: ModelId
  readonly direction: Direction
}

export class MazeObject implements IMazeObject {
  public readonly model: ModelId
  public readonly direction: Direction

  public readonly entity?: ModelEntity

  private usage?: ModelUsage

  constructor(
    modelIdOrCode: ModelId | ModelCode | ModelEntity,
    direction?: Direction, // leave undefined when it doesn't care
    usage?: 'stair'
  ) {
    this.direction = direction ?? NESW[Math.floor(Math.random() * 4)]

    this.usage = usage

    if (typeof modelIdOrCode === 'string') {
      this.model = { code: modelIdOrCode, variant: getVariant(modelIdOrCode) }
    } else if (modelIdOrCode instanceof ModelEntity) {
      this.entity = modelIdOrCode
      this.model = {
        code: modelIdOrCode.getModelCode(this.usage),
      }
    } else {
      this.model = modelIdOrCode
    }
  }
}
