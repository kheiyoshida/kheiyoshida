import { Vec3, Vector3D } from 'maze-gl'
import { MatrixLayerXSize, MatrixLayerZSize } from './layer.ts'
import { NumOfScaffoldMatrixLayers } from './matrix.ts'

export class DistortionDelta {
  public readonly value: Vector3D = [0, 0, 0]
  public move(range: number, speed: number) {
    const rand = Vec3.random(-speed/2, speed/2)
    Vec3.add(this.value, rand)
    if (Vec3.mag(this.value) > range) {
      Vec3.normalize(this.value, range)
    }
  }
}

export class DistortionMatrixLayer {
  public readonly deltas: DistortionDelta[][]
  constructor() {
    this.deltas = Array.from({ length: MatrixLayerZSize }, () =>
      Array.from({ length: MatrixLayerXSize }, () => new DistortionDelta())
    )
  }

  iterate(callback: (delta: DistortionDelta, x: number, z: number) => void) {
    for (let z = 0; z < MatrixLayerZSize; z++) {
      for (let x = 0; x < MatrixLayerXSize; x++) {
        callback(this.deltas[z][x], x, z)
      }
    }
  }

  update(range: number, speed: number) {
    this.iterate((delta) => delta.move(range, speed))
  }

  slide() {}
  turn() {}
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
