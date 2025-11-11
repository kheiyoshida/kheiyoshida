import { ModelCode } from 'maze-models'
import { Direction, NESW } from '../../../core/grid/direction.ts'
import { getVariant, ModelId } from './models.ts'

export type IMazeObject = {
  readonly model: ModelId
  readonly direction: Direction
}

export class MazeObject implements IMazeObject {
  public readonly model: ModelId
  public readonly direction: Direction

  constructor(
    modelIdOrCode: ModelId | ModelCode,
    direction?: Direction // leave undefined when it doesn't care
  ) {
    this.direction = direction ?? NESW[Math.floor(Math.random() * 4)]

    if (typeof modelIdOrCode === 'string') {
      this.model = { code: modelIdOrCode, variant: getVariant(modelIdOrCode) }
    } else {
      this.model = modelIdOrCode
    }
  }
}
