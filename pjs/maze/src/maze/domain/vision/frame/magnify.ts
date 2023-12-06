export type MagnifyRates = number[]

export const DEFAULT_MAGNIFY_RATES: MagnifyRates = [
  1.5, 1, 0.7, 0.3, 0.2, 0.09, 0.04, 0.02, 0.01,
]

/**
 * make mag rates to express narrow corridors
 */
export const narrowPaths = (
  narrow = 0.1,
  limit = 0.5,
  original = DEFAULT_MAGNIFY_RATES
): MagnifyRates =>
  original.map((rate, i) =>
    i !== 0 && i % 2 === 0
      ? rate + (original[i - 1] - rate) * Math.min(limit, narrow)
      : rate
  )

/**
 * make mag rates to express long feel corridor
 */
export const longPath = (
  long: number,
  limit = 0.25,
  original = DEFAULT_MAGNIFY_RATES
): MagnifyRates =>
  original.map((rate, i) => (i < 3 ? rate : rate * Math.max(1 - long, limit)))
