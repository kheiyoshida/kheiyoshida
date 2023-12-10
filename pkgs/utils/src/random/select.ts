import { randomIntBetween, randomIntInclusiveBetween } from './value'

export const randomItemFromArray = <T>(array: T[]): T => {
  if (!array.length) {
    throw Error(`can't get an item from an empty array`)
  }
  return array[randomIntInclusiveBetween(0, array.length - 1)]
}

export const randomItem = <T>(array: T[]): T => array[randomIntBetween(0, array.length)]

export const makeDifferentIntPicker = (min: number, max: number, maxRetry = 100) => {
  let current: number
  const pick = (retry = 0): number => {
    const int = randomIntInclusiveBetween(min, max)
    if (current !== int || retry > maxRetry) {
      current = int
      return current
    }
    return pick(retry + 1)
  }
  return pick
}

export const makeRandomItemPicker = <T>(array: T[]): (() => T) => {
  if (!array.length) {
    throw Error(`can't get an item from an empty array`)
  }
  const getIndex = makeDifferentIntPicker(0, array.length - 1)
  return () => array[getIndex()]
}

/**
 * creates a function that randomly select one from candidates by defined ratio
 */
export const createRandomSelect = <C>(candidates: [number, C][]) => {
  const candiWithPercentage = mapPercentage(ratioToPercentage(candidates))
  return () => {
    const r = Math.random()
    const selected = candiWithPercentage.find(([p]) => r <= p)
    if (!selected) {
      throw Error(`could not randomly select`)
    }
    return selected[1]
  }
}

export const ratioToPercentage = <C>(candidates: [number, C][]) => {
  const sum = candidates.reduce((p, [r]) => p + r, 0)
  return candidates.map(([ratio, c]) => [ratio / sum, c] as [number, C])
}

export const mapPercentage = <C>(candidates: [number, C][]) => {
  const newCandidates = candidates.slice()
  candidates.reduce((prev, [p, _], i) => {
    const inc = prev + p
    newCandidates[i][0] = inc
    return inc
  }, 0)
  return newCandidates
}
