export const delay = (t: number) =>
  new Promise<NodeJS.Timeout>((r) => setTimeout(r, t))

/**
 * generates function that executes after delaying time
 */
export const delayed =
  <R, Fn extends () => R>(t: number, exec: Fn): (() => Promise<R>) =>
  () =>
    delay(t).then(exec)

export const genTimeIntervalQueues = async (
  interval: number,
  fns: Array<() => void>
) => fns.map(fn => delayed(interval, fn))

export const delayedIterate = async (
  interval: number,
  fns: Array<() => void>
) => {
  for (const fn of fns) {
    fn()
    await delay(interval)
  }
}
