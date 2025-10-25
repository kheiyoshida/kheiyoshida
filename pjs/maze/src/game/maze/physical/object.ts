import { Direction } from '../../../core/grid/direction.ts'
import { ModelCode } from './models.ts'

export type IMazeObject = {
  readonly modelCode: ModelCode
  direction: Direction
}

export class MazeObject implements IMazeObject {
  constructor(
    public readonly modelCode: ModelCode,
    public direction: Direction = 'n'
  ) {}
}
