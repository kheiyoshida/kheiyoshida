type TimerKey = 'render' | 'stand' | 'constant'
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

export const setTimer = (key: TimerKey, ...args: Parameters<typeof setTimeout>) => {
  clearTimer(key)
  Timers[key] = setTimeout(...args)
}

export const setIntervalEvent = (key: TimerKey, ...args: Parameters<typeof setInterval>) => {
  clearTimer(key)
  Timers[key] = setInterval(...args)
}
