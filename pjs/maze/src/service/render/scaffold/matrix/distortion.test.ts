import { Vec3, Vector3D } from 'maze-gl'
import { DistortionDelta, DistortionMatrix, DistortionMatrixLayer } from './distortion.ts'
import { MatrixLayerXSize, MatrixLayerZSize } from './layer.ts'

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

  it(`can slide the delta values forward`, () => {
    const distortionLayer = new DistortionMatrixLayer()
    distortionLayer.iterate((delta, x, z) => Vec3.add(delta.value, [x, 0, z]))

    distortionLayer.slide(2)
    expect(distortionLayer.deltas[0][2].value).toEqual([2, 0, 2])
  })

  it(`can turn delta values`, () => {
    const distortionLayer = new DistortionMatrixLayer()
    const visualise = () => {
      const results = []
      for (let z = 0; z < MatrixLayerZSize; z++) {
        let row = ``
        for (let x = 0; x < MatrixLayerXSize; x++) {
          const delta = distortionLayer.deltas[z][x]
          row += `(${delta.value[0]} ${delta.value[2]}) `
        }
        results.push(row)
      }
      return results.reverse().join('\n\n')
    }

    distortionLayer.iterate((delta, x, z) => Vec3.add(delta.value, [x, 0, z]))
    console.log('before\n\n', visualise())
    expect(visualise()).toMatchInlineSnapshot(`
      "(0 6) (1 6) (2 6) (3 6) (4 6) (5 6) 

      (0 5) (1 5) (2 5) (3 5) (4 5) (5 5) 

      (0 4) (1 4) (2 4) (3 4) (4 4) (5 4) 

      (0 3) (1 3) (2 3) (3 3) (4 3) (5 3) 

      (0 2) (1 2) (2 2) (3 2) (4 2) (5 2) 

      (0 1) (1 1) (2 1) (3 1) (4 1) (5 1) 

      (0 0) (1 0) (2 0) (3 0) (4 0) (5 0) "
    `)

    distortionLayer.turn('left')
    console.log('after\n\n', visualise())
    expect(visualise()).toMatchInlineSnapshot(`
      "(0 0) (0 0) (0 0) (0 0) (0 0) (0 0) 

      (0 0) (0 0) (0 0) (0 0) (0 0) (0 0) 

      (0 0) (0 0) (0 0) (0 0) (0 0) (0 0) 

      (-3 5) (-2 5) (-1 5) (0 5) (0 0) (0 0) 

      (-3 4) (-2 4) (-1 4) (0 4) (0 0) (0 0) 

      (-3 3) (-2 3) (-1 3) (0 3) (0 0) (0 0) 

      (-3 2) (-2 2) (-1 2) (0 2) (0 0) (0 0) "
    `)
  })
})

describe(`${DistortionMatrix.name}`, () => {
  it(`can update deltas in bulk`, () => {
    const distortionMatrix = new DistortionMatrix()
    expect(distortionMatrix.layers.length).toBe(7)
    distortionMatrix.update(100, 10)
    distortionMatrix.iterate((delta) => {
      expect(delta.value).not.toEqual([0, 0, 0])
    })
  })
})
