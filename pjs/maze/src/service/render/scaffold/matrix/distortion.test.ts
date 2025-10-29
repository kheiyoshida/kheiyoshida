import { Vec3, Vector3D } from 'maze-gl'
import { DistortionDelta, DistortionMatrix, DistortionMatrixLayer } from './distortion.ts'
import { MatrixLayerXSize, MatrixLayerZSize } from './layer.ts'
import { Distortion } from '../../scaffold_legacy/distortion'

describe(`${DistortionDelta.name}`, () => {
  it(`should update values with given range/speed constraints`, () => {
    const delta = new DistortionDelta()

    let prev: Vector3D = [0, 0, 0]
    for (let i = 0; i < 100; i++) {
      delta.move(100, 10)
      expect(delta.value).not.toEqual(prev)
      expect(Vec3.mag(delta.value)).toBeLessThanOrEqual(100)

      const speed = Vec3.sub(delta.value, prev)
      expect(Math.abs(speed[0])).toBeLessThanOrEqual(10)
      expect(Math.abs(speed[1])).toBeLessThanOrEqual(10)
      expect(Math.abs(speed[2])).toBeLessThanOrEqual(10)

      prev = delta.value.slice() as Vector3D
    }
  })
})

describe(`${DistortionMatrixLayer.name}`, () => {
  it(`should initialise with zero vectors as delta values`, () => {
    const distortionLayer = new DistortionMatrixLayer()
    expect(distortionLayer.deltas.length).toBe(MatrixLayerZSize)
    expect(distortionLayer.deltas[0].length).toBe(MatrixLayerXSize)
    expect(distortionLayer.deltas[0][0]).toBeInstanceOf(DistortionDelta)
    expect(distortionLayer.deltas[0][0].value).toEqual([0, 0, 0])
  })

  it(`can iterate over all deltas`, () => {
    const distortionLayer = new DistortionMatrixLayer()
    const cb = jest.fn()
    distortionLayer.iterate(cb)
    expect(cb).toHaveBeenCalledTimes(MatrixLayerXSize * MatrixLayerZSize)
  })

  it(`can update deltas in bulk`, () => {
    const distortionLayer = new DistortionMatrixLayer()
    distortionLayer.update(100, 10)
    distortionLayer.iterate((delta) => {
      expect(delta.value).not.toEqual([0, 0, 0])
    })
  })
})

describe(`${DistortionMatrix.name}`, () => {
  it(`can update deltas in bulk`, () => {
    const distortionMatrix = new DistortionMatrix()
    expect(distortionMatrix.layers.length).toBe(6)
    distortionMatrix.update(100, 10)
    distortionMatrix.iterate((delta) => {
      expect(delta.value).not.toEqual([0, 0, 0])
    })
  })
})
