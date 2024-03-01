import { makePixelIndexGetter, makePixelPositionShift } from './utils'

test(`${makePixelIndexGetter.name}`, () => {
  const getPixelIndex = makePixelIndexGetter(300)
  expect(getPixelIndex(20, 10)).toMatchObject([12080, 12081, 12082, 12083])
})

test.each([
  // shift values
  [[100, 200], [200, 100]],
  [[0, 100], [100, 0]],
  // abort cases
  [[250, 200], undefined], 
  [[200, 200], undefined],
  [[100, 99], undefined],
])(`${makePixelPositionShift.name}(%o, %o)`, ([x,y], expected) => {
  const makeShift = makePixelPositionShift({ width: 300, height: 300 })
  const shift = makeShift((x,y) => [x + 100, y -100])
  const result = shift(x,y)
  if (expected) {
    expect(result).toMatchObject(expected)
  } else {
    expect(result).toBeUndefined()
  }
})
