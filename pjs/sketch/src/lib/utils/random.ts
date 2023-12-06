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

export function random(rate: number) {
  if (rate > 1 || rate < 0) {
    throw Error('rate should be between 0.0 and 1.0')
  }
  return Math.random() <= rate
}

export const randomItemFromArray = <T>(array: T[]): T => {
  if (!array.length) {
    throw Error(`can't get an item from an empty array`)
  }
  return array[randomIntBetween(0, array.length)]
}

export const makeRandomArrayPicker = <T>(array: T[]): (() => T) => {
  if (!array.length) {
    throw Error(`can't get an item from an empty array`)
  }
  let current = 0
  const pick = (): T => {
    const index = randomIntBetween(0, array.length)
    if (index !== current) {
      current = index
      return array[current]
    }
    return pick()
  }
  return pick
}

export const wobbleInt = (range: number) => (n: number) => {
  return n + randomIntBetween(-range, range)
}

/**
 * create shuffled array
 * @param array 
 * @returns 
 */
export const shuffle = <T>(array: T[]) => {
  const len = Number(array.length)
  return [...Array(len)].map((_, i) => {
    const [s] = array.splice(randomIntBetween(0, len - i), 1)
    return s
  })
}
