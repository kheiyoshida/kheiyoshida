import { ModelEntity } from 'maze-models'
import { Direction, NESW } from '../../../core/grid/direction.ts'

export type IMazeObject = {
  readonly model: ModelEntity
  readonly direction: Direction
}

export class MazeObject implements IMazeObject {
  public readonly model: ModelEntity
  public readonly direction: Direction

  constructor(
    model: ModelEntity,
    direction?: Direction // leave undefined when it doesn't care
  ) {
    this.direction = direction ?? NESW[Math.floor(Math.random() * 4)]
    this.model = model
  }
}
