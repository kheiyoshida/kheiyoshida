import { Vector } from 'p5'
import { createDistortionDelta, restrainVectorWithinRange } from './delta'
import * as distortion from './delta'

describe(`DistortionDelta`, () => {
  it(`should hold the delta values`, () => {
    const v = new Vector(0, 1, 2)
    const delta = createDistortionDelta(v)
    expect(delta.values).toMatchObject([0, 1, 2])
  })
  it(`can move within range`, () => {
    jest.spyOn(distortion, 'getMovementValues').mockReturnValue([1, 0, 0])
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
  const v = new Vector(10, 0, 0)
  restrainVectorWithinRange(v, 5)
  expect(v.array()).toMatchObject([5, 0, 0])
})
