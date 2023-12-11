
export const getSubset = <T extends object>(obj: T, keyArray: Array<keyof T>) => {
  return Object.fromEntries(keyArray.map((k) => [k, obj[k]]))
}

export const valueOrFn = <T, A>(a: A, vof: T | ((a: A) => T)) => {
  if (vof instanceof Function) return vof(a)
  else return vof
}

