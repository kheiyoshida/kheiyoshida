export const wrapCatch =
  <Fn extends (...args: any[]) => any>(fn: Fn) =>
  (...args: Parameters<Fn>) => {
    try {
      return fn(...args)
    } catch (e) {
      console.log(`[${fn.name}]`, ...args)
      throw e
    }
  }

export const wrapDebug =
  <Fn extends (...args: any[]) => any>(fn: Fn) =>
  (...args: Parameters<Fn>) => {
    console.log(`[${fn.name}]`, ...args)
    const result = fn(...args)
    console.log(`[${fn.name} result]`, result)
    return result
  }


export const wrapLogger =
<T>(fn: (...args: any) => T) =>
(...args: any) => {
  const returned = fn(args)
  console.log(returned)
  return returned
}
