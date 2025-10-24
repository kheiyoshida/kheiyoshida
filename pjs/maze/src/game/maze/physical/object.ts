import { Direction } from '../../../core/grid/direction.ts'

export class MazeObject {
  constructor(public readonly modelCode: string) {}

  public direction: Direction = 'n'
}
