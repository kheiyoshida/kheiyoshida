import { clamp, randomIntInclusiveBetween } from 'utils'
import { store } from '../../store'

const aestheticsRangeMap = {
  0: [1, 3],
  1: [4, 6],
  2: [7, 9],
} as const

export const updateAesthetics = () => {
  const delta = randomIntInclusiveBetween(-3, 3)
  if (store.current.floor % 3 === 0) {
    // should cross the borders only when reaching multiples of 3
    store.setAesthetics(clamp(store.current.aesthetics + delta, 1, 9))
  } else {
    const range =
      aestheticsRangeMap[
        Math.floor((store.current.aesthetics - 1) / 3) as keyof typeof aestheticsRangeMap
      ]
    store.setAesthetics(clamp(store.current.aesthetics + delta, range[0], range[1]))
  }
}
