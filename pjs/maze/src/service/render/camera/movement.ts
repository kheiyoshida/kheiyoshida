export const createSinArray = (length: number, max = 0.5) =>
  [...Array(length)].map((_, i) => Math.sin(max * Math.PI * ((i + 1) / length)))

export const createAccumulatedDistanceArray = (length: number): number[] => {
  const speedArray = createSinArray(length, 1)
  const distArray: number[] = []
  const total = speedArray.reduce((prev, curr) => {
    const dist = prev + curr
    distArray.push(dist)
    return dist
  }, 0)
  const normalized = distArray.map((dist) => dist / total)
  return normalized
}

export const getStairUpDown = (i: number, toggleInterval = 2): boolean => {
  if (Math.floor(i / toggleInterval) % 2 === 0) return true
  return false
}
