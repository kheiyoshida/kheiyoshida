export const kickFactory = (length: number, division: 16 | 8) => {
  if (length % 2 !== 0) {
    throw Error(`length should be even number`)
  }
  const interval = division / 4
  const numOfKicks = Math.floor(length / (division / 4))
  return Object.fromEntries(
    [...Array(numOfKicks)]
      .map((_, i) => {
        return [
          i * interval,
          [
            {
              pitch: 30,
              vel: 100,
              dur: 1,
            },
          ],
        ]
      })
  )
}
