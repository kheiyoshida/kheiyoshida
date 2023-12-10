import { delay } from './delay'

const flushPromises = () => new Promise(jest.requireActual('timers').setImmediate)

test(`${delay.name}`, async () => {
  jest.useFakeTimers()
  const fn = jest.fn()
  delay(1000).then(fn)

  expect(fn).not.toHaveBeenCalled()

  jest.runAllTimers()
  await flushPromises()
  expect(fn).toHaveBeenCalled()
})
