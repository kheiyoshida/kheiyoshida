import { Range } from '../utils/types'

type RANDOM = 'random'

export type Note = {
  pitch: number | RANDOM
  dur: number | Range
  vel: number | Range
}
