import { MazeObject } from './object.ts'
import { Direction, rotated } from '../../../core/grid/direction.ts'

export class MazeBlock {
  constructor(public readonly objects: MazeObject[]) {}

  public rotated(perspectiveDir: Direction): MazeBlock {
    return new MazeBlock(
      this.objects.map((obj) => new MazeObject(obj.modelCode, rotated(obj.direction, perspectiveDir)))
    )
  }
}
