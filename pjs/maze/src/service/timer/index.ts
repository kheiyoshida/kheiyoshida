type TimerKey = 'render' | 'stand' | 'constant'
type TimerId = ReturnType<typeof setTimeout>

const __Timers: { [k in TimerKey]: TimerId | undefined } = {
  render: undefined,
  stand: undefined,
  constant: undefined,
}

export const clearTimer = (key: TimerKey) => {
  if (__Timers[key]) {
    clearTimeout(__Timers[key])
  }
  __Timers[key] = undefined
}

export const setTimer = (key: TimerKey, ...args: Parameters<typeof setTimeout>) => {
  clearTimer(key)
  __Timers[key] = setTimeout(...args)
}

export const setIntervalEvent = (key: TimerKey, ...args: Parameters<typeof setInterval>) => {
  clearTimer(key)
  __Timers[key] = setInterval(...args)
}
