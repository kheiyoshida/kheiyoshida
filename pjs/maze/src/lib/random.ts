import { makeWeightedRandomPicker } from 'utils'

export function random(rate: number) {
  if (rate > 1 || rate < 0) {
    throw Error('rate should be between 0.0 and 1.0')
  }
  return Math.random() <= rate
}

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

export const randomItem = <T>(list: T[]): T => list[randomIntBetween(0, list.length)]

/**
 * get ranodm modulation value
 * including negative number
 */
export const getRandomMod = (max: number, percentage: number) =>
  randomBetween(-max, max) * percentage

/**
 * modulate original value by defined percentage of max value
 */
export const modulate = (original: number, max: number, percentage: number) =>
  original + randomBetween(-max, max) * percentage

/**
 * turn candidates' ratio to percentage
 * @param candidates
 * @returns
 */
export const ratioToPercentage = <C>(candidates: [number, C][]) => {
  const sum = candidates.reduce((p, [r]) => p + r, 0)
  return candidates.map(([ratio, c]) => [ratio / sum, c] as [number, C])
}

/**
 * map percentage so that Math.random can pick one
 */
export const mapPercentage = <C>(candidates: [number, C][]) => {
  const newCandidates = candidates.slice()
  candidates.reduce((prev, [p, _], i) => {
    const inc = prev + p
    newCandidates[i][0] = inc
    return inc
  }, 0)
  return newCandidates
}

export const createRandomSelect = makeWeightedRandomPicker
