import { Range } from 'utils'
import { MidiNum } from './constants'

type RANDOM = 'random'

export type Note = {
  pitch: MidiNum | RANDOM
  dur: number | Range
  vel: number | Range
}
