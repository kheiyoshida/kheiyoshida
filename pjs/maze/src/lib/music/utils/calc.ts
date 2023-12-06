import { Range } from '../utils/types'

export const randomBetween = (min: number, max: number) => {
  const ratio = Math.random()
  return (max - min) * ratio + min
}

/**
 * note: not inclusive for max value
 */
export const randomIntBetween = (min: number, max: number) => {
  return Math.floor(randomBetween(min, max))
}

export const random = (rate: number) => {
  if (rate > 1 || rate < 0) {
    throw Error('rate should be between 0.0 and 1.0')
  }
  return Math.random() <= rate
}

export const pickRange = (numOrRange: number|Range) => {
  if (typeof numOrRange === 'number') {
    return numOrRange
  } else {
    return randomIntBetween(numOrRange.min, numOrRange.max)
  }
}
