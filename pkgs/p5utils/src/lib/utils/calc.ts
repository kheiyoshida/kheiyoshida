export const getDivisors = (n: number) => {
  return [...Array(n + 1).keys()].slice(1).filter((i) => n % i === 0)
}

export const getFloatDivisors = (n: number, float = 1, limit = 10) => {
  return [...Array(Math.pow(10, float) * (n + 1)).keys()]
    .slice(1)
    .map((i) => Number((i / Math.pow(10, float)).toFixed(2)))
    .filter((i) => n % i === 0 && i >= 1)
    .slice(0, limit)
}

export const getCommonDivisors = (a: number, b: number) => {
  return getDivisors(a).filter((a) => getDivisors(b).includes(a))
}

export const getCommonFloatDivisors = (a: number, b: number) => {
  return getFloatDivisors(a).filter((a) => getFloatDivisors(b).includes(a))
}

export const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max)
}

/**
 * clamp the value and operate additional process if clamped
 * @param val
 * @param min
 * @param max
 */
export const clampAnd =
  (val: number, min: number, max: number) => (and: (clamped: number) => void) => {
    const clamped = clamp(val, min, max)
    if (clamped !== val) {
      and(clamped)
    }
  }
