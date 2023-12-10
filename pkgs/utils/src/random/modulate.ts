import { randomIntBetween, randomIntInclusiveBetween } from './value'

export const makeIntWobbler = (range: number) => (int: number) => {
  return int + randomIntInclusiveBetween(-range, range)
}

export const createShuffledArray = <T>(array: T[]) => {
  const len = Number(array.length)
  return [...Array(len)].map((_, i) => {
    const [s] = array.splice(randomIntBetween(0, len - i), 1)
    return s
  })
}
