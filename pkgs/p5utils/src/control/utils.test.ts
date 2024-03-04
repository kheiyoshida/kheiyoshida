import { makeDoubleTapBlocker } from "./utils";

test(`${makeDoubleTapBlocker.name}`, () => {
  jest.useFakeTimers()
  const preventMs = 10
  const doubleTapBlocker = makeDoubleTapBlocker(preventMs)
  expect(doubleTapBlocker.isNowSecondTap()).toBe(false)

  jest.advanceTimersByTime(1)
  expect(doubleTapBlocker.isNowSecondTap()).toBe(true)

  jest.advanceTimersByTime(preventMs)
  expect(doubleTapBlocker.isNowSecondTap()).toBe(false)
  
  jest.useRealTimers()
})