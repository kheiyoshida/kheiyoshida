import { ViewPosition } from '../../../integration/query/structure/view/view.ts'
import { DeformedBox, Vec3 } from 'maze-gl'
import { ScaffoldPointMatrix } from './matrix/matrix.ts'
import { DistortionMatrix } from './matrix/distortion.ts'

export type ScaffoldValues = {
  floor: number
  path: number
  wall: number
  distortionRange: number
  distortionSpeed: number
}

export class Scaffold {
  private pointMatrix!: ScaffoldPointMatrix
  private distortionMatrix: DistortionMatrix = new DistortionMatrix()

  getBox(viewPosition: ViewPosition): DeformedBox {
    return this.pointMatrix.getBox(viewPosition)
  }

  update(values: ScaffoldValues): void {
    this.pointMatrix = new ScaffoldPointMatrix(values.floor, values.path, values.wall)
    this.distortionMatrix.update(values.distortionRange, values.distortionSpeed)
    this.applyDistortion()
  }

  private applyDistortion() {
    this.distortionMatrix.iterate((delta, x, y, z) => {
      const point = this.pointMatrix.layers[y].points[z][x]
      Vec3.add(point, delta.value)
    })
  }
}
