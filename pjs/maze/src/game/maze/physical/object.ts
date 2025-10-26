import { Direction } from '../../../core/grid/direction.ts'
import { ModelCode } from './models.ts'

export type IMazeObject = {
  readonly modelCode: ModelCode
  readonly direction: Direction
}

export class MazeObject implements IMazeObject {
  constructor(
    public readonly modelCode: ModelCode,
    public readonly direction: Direction = 'n'
  ) {}
}
