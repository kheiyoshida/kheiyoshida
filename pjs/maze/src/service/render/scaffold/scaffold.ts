import { ViewPosition } from '../../../integration/query/structure/view/view.ts'
import { DeformedBox } from 'maze-gl'
import { ScaffoldPointMatrix } from './matrix/matrix.ts'

export type ScaffoldValues = {
  floor: number
  path: number
  wall: number
  distortionRange: number
  distortionSpeed: number
}

export class Scaffold {
  private pointMatrix!: ScaffoldPointMatrix

  getBox(viewPosition: ViewPosition): DeformedBox {
    return this.pointMatrix.getBox(viewPosition)
  }

  update(values: ScaffoldValues): void {
    this.pointMatrix = new ScaffoldPointMatrix(values.floor, values.path, values.wall)
  }
}
