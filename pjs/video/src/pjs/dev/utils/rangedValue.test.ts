import { RangedValue } from './rangedValue'

test(`${RangedValue.name}`, () => {
  const val = new RangedValue(0, 1)

  val.anchor = 0.5
  val.offsetRange = 1.0
  expect(val.getConcreteValue(0.5)).toBeCloseTo(0.5)
  expect(val.getConcreteValue(0.6)).toBeCloseTo(0.7)
  expect(val.getConcreteValue(0.4)).toBeCloseTo(0.3)
  expect(val.getConcreteValue(0.2)).toBeCloseTo(0.0)
  expect(val.getConcreteValue(0.0)).toBeCloseTo(0.0)

  val.anchor = 0.5
  val.offsetRange = 0.5
  expect(val.getConcreteValue(0.5)).toBeCloseTo(0.5)
  expect(val.getConcreteValue(0.6)).toBeCloseTo(0.6)
})
