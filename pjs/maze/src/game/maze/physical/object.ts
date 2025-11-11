import { Direction } from '../../../core/grid/direction.ts'
import { ModelCode, ModelId } from './models.ts'

export type IMazeObject = {
  readonly model: ModelId
  readonly direction: Direction
}

export class MazeObject implements IMazeObject {
  public readonly model: ModelId

  constructor(
    modelIdOrCode: ModelId | ModelCode,
    public readonly direction: Direction = 'n'
  ) {
    if (typeof modelIdOrCode === 'string') {
      this.model = { code: modelIdOrCode }
    } else {
      this.model = modelIdOrCode
    }
  }
}
