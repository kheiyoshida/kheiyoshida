export const randomFire = (rate: number) => {
  if (rate > 1 || rate < 0) {
    throw Error('rate should be between 0.0 and 1.0')
  }
  return Math.random() <= rate
}

export const randomFloatBetween = (min: number, max: number) => {
  const ratio = Math.random()
  return (max - min) * ratio + min
}

/**
 * not inclusive for max value
 * @deprecated
 */
export const randomIntBetween = (min: number, max: number) => {
  return Math.floor(randomFloatBetween(min, max))
}

export const randomIntInclusiveBetween = (min: number, max: number) => {
  return Math.floor(randomFloatBetween(min, max + 1))
}
