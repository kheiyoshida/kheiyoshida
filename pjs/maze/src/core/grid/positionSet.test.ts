import { PositionSet } from './positionSet.ts'

describe(`${PositionSet.name}`, () => {
  it(`behaves as a set for anonymous Position2D objects`, () => {
    const posA = { x: 1, y: 1 }
    const posB = { x: 2, y: 2 }
    const posC = { x: 2, y: 2 }

    const set = new PositionSet()
    set.add(posA)
    expect(set.has(posA)).toBe(true)
    expect(set.has(posB)).toBe(false)

    set.add(posB)
    expect(set.has(posB)).toBe(true)
    expect(set.has(posC)).toBe(true) // the same positions are considered as the same object
  })

  it(`can iterate over all positions`, () => {
    const set = new PositionSet()
    set.add({ x: 1, y: 1 })
    set.add({ x: 2, y: 2 })
    set.add({ x: 3, y: 3 })

    const fn = jest.fn()
    for (const pos of set.iterator()) {
      fn(pos)
    }
    expect(fn).toHaveBeenCalledTimes(3)
    expect(fn).toHaveBeenNthCalledWith(1, { x: 1, y: 1 })
    expect(fn).toHaveBeenNthCalledWith(2, { x: 2, y: 2 })
    expect(fn).toHaveBeenNthCalledWith(3, { x: 3, y: 3 })
  })
})
