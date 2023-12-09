/**
 * creates a unique id generator.
 *
 * make sure the project has only one caller for this
 *
 * @returns unique id
 */
export const incrementalId = () => {
  let current = 0
  return () => {
    current += 1
    return current
  }
}

export const changingNumber = (
  determineAmount: (current: number) => number,
  min: number,
  max: number,
  initial: number
) => {
  let current = initial
  let up = true
  const renew = () => {
    if (current >= max) {
      up = false
    }
    if (current <= min) {
      up = true
    }
    const amount = determineAmount(current)
    current += up ? amount : -amount
  }
  return {
    renew,
    current,
  }
}
