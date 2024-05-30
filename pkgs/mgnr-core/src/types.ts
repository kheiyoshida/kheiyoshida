import { SequenceGenerator } from './generator/Generator'

export type LoopEventKey = 'elapsed' | 'ended'

export type SequenceLoopEventContext = {
  generator: SequenceGenerator
}

export type LoopElapsedHandler = (context: SequenceLoopEventContext) => void
export type LoopEndedHandler = (
  context: SequenceLoopEventContext & { repeatLoop: (numOfLoops?: number) => void }
) => void

export type LoopEvent = {
  elapsed?: LoopElapsedHandler
  ended?: LoopEndedHandler
}

export type MutateStrategy = 'randomize' | 'move' | 'inPlace' | 'recursion'
export type MutateSpec = {
  rate: number
  strategy: MutateStrategy
}
