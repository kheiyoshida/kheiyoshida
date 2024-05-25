import { OutletPort } from './Outlet'

export type SeqEventKey = 'elapsed' | 'ended'

export type SequenceLoopEventContext = {
  out: OutletPort
  loop: number
  endTime: number
}

export type SequenceLoopElapsedHandler = (context: SequenceLoopEventContext) => void
export type SequenceLoopEndedHandler = (
  context: SequenceLoopEventContext & { repeatLoop: () => void }
) => void

export type SeqEvent = {
  elapsed?: SequenceLoopElapsedHandler
  ended?: SequenceLoopEndedHandler
}

export type MutateStrategy = 'randomize' | 'move' | 'inPlace' | 'recursion'
export type MutateSpec = {
  rate: number
  strategy: MutateStrategy
}
