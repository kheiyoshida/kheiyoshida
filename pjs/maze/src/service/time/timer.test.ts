import { makeIntervalHandler } from './timer'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

test(`${makeIntervalHandler.name}`, () => {
  const intervalMS = 4
  const timer = makeIntervalHandler(intervalMS, 4)
  const eventHandler = jest.fn()
  timer(eventHandler)

  // first frame
  jest.advanceTimersByTime(2)
  expect(eventHandler).not.toHaveBeenCalled()
  jest.advanceTimersByTime(2)
  expect(eventHandler).toHaveBeenCalledWith(1)

  // frame count
  jest.advanceTimersByTime(4)
  expect(eventHandler).toHaveBeenCalledWith(2)
  jest.advanceTimersByTime(4)
  expect(eventHandler).toHaveBeenCalledWith(3)
  jest.advanceTimersByTime(4)
  expect(eventHandler).toHaveBeenCalledWith(0)
})