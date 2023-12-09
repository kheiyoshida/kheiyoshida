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
