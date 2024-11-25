import { createDistortionDelta, restrainVectorWithinRange } from './delta.ts'
import { Vector3D } from 'maze-gl'
import { Vec3 } from 'maze-gl'

describe(`DistortionDelta`, () => {
  it(`should hold the delta values`, () => {
    const v: Vector3D = [0, 1, 2]
    const delta = createDistortionDelta(v)
    expect(delta.values).toMatchObject([0, 1, 2])
  })
  it(`can move within range`, () => {
    jest.spyOn(Vec3, 'random').mockReturnValue([1, 0, 0])
    const delta = createDistortionDelta()
    delta.move(3)
    expect(delta.values).toMatchObject([1, 0, 0])
    delta.move(3)
    expect(delta.values).toMatchObject([2, 0, 0])
    delta.move(3)
    expect(delta.values).toMatchObject([3, 0, 0])
    delta.move(3)
    expect(delta.values).toMatchObject([3, 0, 0]) // restrained
  })
})

test(`${restrainVectorWithinRange.name}`, () => {
  const v: Vector3D = [10, 0, 0]
  restrainVectorWithinRange(v, 5)
  expect(v).toMatchObject([5, 0, 0])
})
