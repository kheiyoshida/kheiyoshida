import { Vec3, Vector3D } from 'maze-gl'
import { MatrixLayerXSize, MatrixLayerZSize } from './layer.ts'
import { NumOfScaffoldMatrixLayers } from './matrix.ts'
import { LR } from '../../../../core/grid/direction.ts'

export class DistortionDelta {
  public readonly value: Vector3D = [0, 0, 0]
  public movement: Vector3D = Vec3.random()

  public reachedBorder = false

  public move(range: number, speed: number) {
    this.reachedBorder = false
    Vec3.normalize(this.movement, speed)
    Vec3.add(this.value, this.movement)

    if (Vec3.mag(this.value) > range) {
      this.reachedBorder = true
      Vec3.normalize(this.value, range)
      this.movement = Vec3.randomMag(speed)
    }
  }

  public turnValue(lr: LR) {
    const [prevX, _, prevZ] = this.value.slice()
    const [pmX, __, pmZ] = this.movement.slice()
    if (lr === 'left') {
      this.value[0] = -prevZ
      this.value[2] = prevX
      this.movement[0] = -pmZ
      this.movement[2] = pmX
    } else {
      this.value[0] = prevZ
      this.value[2] = -prevX
      this.movement[0] = -pmZ
      this.movement[2] = pmX
    }
  }
}

export class DistortionMatrixLayer {
  private _deltas: DistortionDelta[][]
  public get deltas() {
    return this._deltas
  }

  constructor() {
    this._deltas = DistortionMatrixLayer.initDeltas()
  }

  static initDeltas() {
    return Array.from({ length: MatrixLayerZSize }, () =>
      Array.from({ length: MatrixLayerXSize }, () => new DistortionDelta())
    )
  }

  iterate(callback: (delta: DistortionDelta, x: number, z: number) => void) {
    for (let z = 0; z < MatrixLayerZSize; z++) {
      for (let x = 0; x < MatrixLayerXSize; x++) {
        callback(this._deltas[z][x], x, z)
      }
    }
  }

  update(range: number, speed: number) {
    this.iterate((delta) => delta.move(range, speed))
  }

  slide(distance = 2) {
    const newDeltas: DistortionDelta[][] = DistortionMatrixLayer.initDeltas()
    this.iterate((_, x, z) => {
      const nz = (z + distance)
      newDeltas[z][x] = this._deltas[nz]?.[x] ?? new DistortionDelta()
    })
    this._deltas = newDeltas
  }

  private static TurnPivot = { px: 2.5, pz: 0.5 }

  turn(lr: LR) {
    const newDeltas: DistortionDelta[][] = DistortionMatrixLayer.initDeltas()
    const { px, pz } = DistortionMatrixLayer.TurnPivot
    this.iterate((_, x, z) => {
      let nx, nz
      if (lr === 'left') {
        nx = (px + (z - pz))
        nz = (pz - (x - px))
      } else {
        nx = (px - (z - pz))
        nz = (pz + (x - px))
      }
      newDeltas[z][x] = this._deltas[nz]?.[nx] ?? new DistortionDelta()
      newDeltas[z][x].turnValue(lr)
    })
    this._deltas = newDeltas
  }
}

export class DistortionMatrix {
  public readonly layers: DistortionMatrixLayer[]
  constructor() {
    this.layers = Array.from({ length: NumOfScaffoldMatrixLayers }, () => new DistortionMatrixLayer())
  }

  iterate(callback: (delta: DistortionDelta, x: number, y: number, z: number) => void) {
    for (let y = 0; y < NumOfScaffoldMatrixLayers; y++) {
      this.layers[y].iterate((delta, x, z) => callback(delta, x, y, z))
    }
  }

  update(range: number, speed: number) {
    this.iterate((delta) => delta.move(range, speed))
  }
}
