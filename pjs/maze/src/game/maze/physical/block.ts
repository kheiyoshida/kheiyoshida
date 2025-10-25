import { MazeObject } from './object.ts'

export class MazeBlock {
  constructor(public readonly objects: MazeObject[]) {}
}
