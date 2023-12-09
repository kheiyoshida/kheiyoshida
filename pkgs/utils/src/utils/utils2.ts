export const deepCopy = <O extends Object>(obj: O) => {
  return JSON.parse(JSON.stringify(obj))
}

export const valueOrFn = <T, A>(a: A, vof: T | ((a: A) => T)) => {
  if (vof instanceof Function) return vof(a)
  else return vof
}

/**
 * list all the combinations in an array
 * @param items
 * @returns
 */
export const combination = <T>(items: T[]) =>
  items.flatMap((item, i) =>
    items.slice(i + 1).map((another) => [item, another])
  )
