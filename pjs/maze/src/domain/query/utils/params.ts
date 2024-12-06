import { clamp } from 'utils'

/**
 * make a function that calculates a value based on given parameters
 *
 * @param min the value at changeEndThreshold and below
 * @param max the value at changeStartThreshold and above
 * @param changeStartThreshold
 * @param changeEndThreshold
 */
export const makeDecreasingParameter =
  (min: number, max: number, changeStartThreshold: number, changeEndThreshold = 0) =>
  (status: number) => {
    const diff = max - min
    const ratio =
      status >= changeStartThreshold
        ? 1
        : (status - changeEndThreshold) / (changeStartThreshold - changeEndThreshold)
    return clamp(min + ratio * diff, min, max)
  }

export const makeIncreasingParameter =
  (min: number, max: number, threshold: number = 100) =>
  (status: number) => {
    const diff = max - min
    const ratio = status >= threshold ? 0 : 1 - status / threshold
    return clamp(min + ratio * diff, min, max)
  }

