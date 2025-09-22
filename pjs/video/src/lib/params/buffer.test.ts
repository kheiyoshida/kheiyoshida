import { ValueBuffer } from './buffer'

test(`${ValueBuffer.name}`, () => {
  const applyFn = jest.fn()
  const buffer = new ValueBuffer<number>(0)

  expect(buffer.value).toBe(0)

  buffer.update(2)
  expect(buffer.value).toBe(2)

  buffer.apply(applyFn)
  expect(applyFn).toHaveBeenLastCalledWith(2)

  buffer.apply(applyFn)
  expect(applyFn).toHaveBeenCalledTimes(1) // not called again

  buffer.update(3)
  buffer.apply(applyFn)
  expect(applyFn).toHaveBeenCalledTimes(2) // called with new value
  expect(applyFn).toHaveBeenLastCalledWith(3)
})
