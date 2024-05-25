import { MonophoniManager, MonophonicMap, avoidIntersect } from './Monophonic'

describe(`${MonophoniManager.name}`, () => {
  test(`register note`, () => {
    const monophonic = new MonophoniManager([
      { min: 20, max: 60 },
      { min: 60, max: 120 },
    ])
    expect(monophonic.register(40, 1, 3)).toEqual([40, 1, 3])
    expect(monophonic.register(40, 2, 4)).toEqual([40, 3, 4])
    expect(monophonic.register(40, 2, 3)).toEqual(null)
    expect(monophonic.register(45, 2, 3)).toEqual(null)

    // it uses different map and manages polyphonic separately
    expect(monophonic.register(60, 2, 3)).toEqual([60, 2, 3])
    expect(monophonic.register(65, 2, 3)).toEqual(null)
    expect(monophonic.register(65, 3, 4)).toEqual([65, 3, 4])
  })
})

describe(`${MonophonicMap.name}`, () => {
  test(`register and check`, () => {
    const mono = new MonophonicMap()

    // register in empty time range
    expect(mono.register([1, 3])).toEqual([1, 3])
    expect(mono.register([5, 7])).toEqual([5, 7])

    // register in filled time range
    expect(mono.register([6, 8])).toEqual([7, 8])
    expect(mono.register([4, 6])).toEqual([4, 5])
    expect(mono.register([2, 6])).toEqual([3, 4])
    expect(mono.register([3, 5])).toEqual(null)
  })
  test(`clear`, () => {
    const mono = new MonophonicMap()
    mono.register([1, 3])
    mono.register([5, 7])
    mono.clear(4)
    expect(mono.register([4, 6])).toEqual([4, 5])
    expect(mono.register([2, 6])).toEqual([2, 4])
  })
})

test(`${avoidIntersect.name}`, () => {
  expect(avoidIntersect([1, 3], [3, 5])).toEqual([3, 5])
  expect(avoidIntersect([1, 3], [0, 0.5])).toEqual([0, 0.5])
  expect(avoidIntersect([1, 3], [2, 4])).toEqual([3, 4])
  expect(avoidIntersect([1, 3], [0, 2])).toEqual([0, 1])
  expect(avoidIntersect([1, 3], [0, 5])).toEqual([0, 1])
})
