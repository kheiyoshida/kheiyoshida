export const makeRotate = (min = 0, max = 360) => {
  let current = 0
  return {
    increment: (v: number) => {
      const next = current + v
      current = next > max ? next % max : next < min ? max - (min - next) : next
    },
    get current() {
      return current
    },
  }
}
