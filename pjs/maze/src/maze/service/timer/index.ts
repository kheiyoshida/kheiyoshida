/**
 * key to look up current timer's existence and id
 */
type TimerKey = 'render' | 'stand' | 'constant'

/**
 * timer id emitted by `setTimeout`
 */
type TimerId = ReturnType<typeof setTimeout>

const Timers: { [k in TimerKey]: TimerId | undefined } = {
  render: undefined,
  stand: undefined,
  constant: undefined,
}

export const clearTimer = (key: TimerKey) => {
  if (Timers[key]) {
    clearTimeout(Timers[key])
  }
  Timers[key] = undefined
}

export const setTimer = (
  key: TimerKey,
  ...args: Parameters<typeof setTimeout>
) => {
  clearTimer(key)
  Timers[key] = setTimeout(...args)
}

/**
 * set interval event that fires after the initial interval
 */
export const setIntervalEvent = (
  key: TimerKey,
  ...args: Parameters<typeof setInterval>
) => {
  clearTimer(key)
  // Timers[key] = setTimeout(() => {
  //   Timers[key] = setInterval(...args)
  // }, args[1])
  Timers[key] = setInterval(...args)
}
