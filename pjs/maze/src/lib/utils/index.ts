export const pipeDebug = <T>(t: T, _: number, a: T[]) => {
  console.log(a)
  return t
}

export const wrapLogger =
  <T>(fn: (...args: any) => T) =>
  (...args: any) => {
    const returned = fn(args)
    console.log(returned)
    return returned
  }

/**
 * join array using the last item of array as junction
 */
export const concatWithJunction = <T>(a: T[], b: T[]): T[] => {
  if (!a.length) return b
  if (!b.length) return a
  return [...a].concat([...b].slice(1))
}

export const maybeConcat = <T>(...args: (T[] | undefined)[]): T[] | undefined =>
  args.some(Boolean)
    ? [...args].filter((a): a is T[] => a !== undefined).flatMap((a) => a)
    : undefined

export const combination = <T>(valueTuple: [T, T], compareTuple: [T, T]): boolean => {
  if (valueTuple[0] === compareTuple[0] && valueTuple[1] === compareTuple[1]) return true
  if (valueTuple[0] === compareTuple[1] && valueTuple[1] === compareTuple[0]) return true
  return false
}

/**
 * get object's field that can be undefined at first but assured at runtime
 */
export const lazyObjectGetField = <T extends Object>(
  obj: T,
  key: keyof T
): Required<T>[keyof T] => {
  if (obj[key] !== undefined) return obj[key]
  else throw Error(`lazy object is not initialized?`)
}

export const lazyObjectGet = <T extends Object>(obj: T): Required<T> =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (v !== undefined) return [k, v]
      else throw Error(`lazy object is not initialized?`)
    })
  ) as Required<T>

export function pipe<A>(value: A): A
export function pipe<A, B>(value: A, fn1: (input: A) => B): B
export function pipe<A, B, C>(value: A, fn1: (input: A) => B, fn2: (input: B) => C): C
export function pipe<A, B, C, D>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D
): D
export function pipe<A, B, C, D, E>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E
): E
export function pipe(value: any, ...fns: Function[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value)
}

/**
 * make sure the function's called once
 * @param fn function to execute
 */
export const once = <F extends (...args: any) => any>(fn: F) => {
  let done = false
  return (...args: Parameters<F>) => {
    if (!done) {
      done = true
      return fn(args)
    }
  }
}

export const deepCopy = <O extends Object>(obj: O) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * returns spliced array
 */
export const toSpliced = <T>(arr: T[], ...args: Parameters<typeof Array.prototype.splice>) => {
  arr.splice(...args)
  return arr
}

/**
 * convert percent in float number into float with 2 numbers after precision
 */
export const roundPercent = (n: number) => Math.round(n * 100) / 100

/**
 * convert percent in int into float number
 */
export const toFloatPercent = (n: number) => n * 0.01
