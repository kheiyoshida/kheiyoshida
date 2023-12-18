import { Generator } from '../generator/Generator'
import { SequenceOut } from './SequenceOut'

export type SeqEventKey = 'elapsed' | 'ended'

export type SequenceLoopEventContext = {
  out: SequenceOut
  loop: number
  endTime: number
}
export type SequenceLoopEventHandler = (context: SequenceLoopEventContext) => void

export type SeqEvent = {
  elapsed?: SequenceLoopEventHandler
  ended?: SequenceLoopEventHandler
}

export type MutateStrategy = 'randomize' | 'move' | 'inPlace' | 'recursion'
export type MutateSpec = {
  rate: number
  strategy: MutateStrategy
}
