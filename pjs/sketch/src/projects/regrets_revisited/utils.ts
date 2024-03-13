export const makeCycle = (maxVal: number, minVal = 0) => {
  if (maxVal < minVal) throw Error(`maxVal should be greater`)
  const range = maxVal - minVal
  return (value: number) => {
    if (value >= maxVal) return (value % range) + minVal
    else if (value < minVal) return (range + value) + minVal
    return value
  }
}
