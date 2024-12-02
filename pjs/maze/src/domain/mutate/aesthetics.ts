import { clamp, makeConstrainedRandomEmitter, randomIntInclusiveBetween } from 'utils'
import { store } from '../../store'

type AestheticsRangeNumber = 0 | 1 | 2

const aestheticsRangeMap = {
  0: [1, 3],
  1: [4, 6],
  2: [7, 9],
} as const

export const updateAesthetics = () => {
  // cross the borders only when reaching even floors
  if (store.current.floor % 2 === 0) {
    store.setAesthetics(constrainedChangeBeyondRange())
  } else {
    store.setAesthetics(changeWithinRange())
  }
}

const changeWithinRange = () => {
  const current = store.current.aesthetics
  const delta = randomIntInclusiveBetween(-3, 3)
  const range = aestheticsRangeMap[Math.floor((store.current.aesthetics - 1) / 3) as AestheticsRangeNumber]
  return clamp(current + delta, range[0], range[1])
}

const changeBeyondRange = () => {
  const current = store.current.aesthetics
  const delta = randomIntInclusiveBetween(-3, 3)
  return clamp(current + delta, 1, 9)
}

const constrainedChangeBeyondRange = makeConstrainedRandomEmitter(
  changeBeyondRange,
  (v, p) => getRangeNum(v) === getRangeNum(p),
  2 // can stay in the same rendering style for 2 * 3 floors in a row, but not more than that
)

const getRangeNum = (a: number) => {
  if (a >= 1 && a <= 3) return 0
  if (a >= 4 && a <= 6) return 1
  if (a >= 7 && a <= 9) return 2
}
