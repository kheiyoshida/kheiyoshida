import { clamp } from 'utils'

export const makeDecreasingParameter =
  (min: number, max: number, threshold: number = 100) =>
  (status: number) => {
    const diff = max - min
    const ratio = status >= threshold ? 1 : status / threshold
    return clamp(min + ratio * diff, min, max)
  }

export const makeIncreasingParameter =
  (min: number, max: number, threshold: number = 100) =>
  (status: number) => {
    const diff = max - min
    const ratio = status >= threshold ? 0 : 1 - status / threshold
    return clamp(min + ratio * diff, min, max)
  }

