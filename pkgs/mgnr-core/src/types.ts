import { SequenceGenerator } from './generator/Generator'

export type LoopEventKey = 'elapsed' | 'ended'

export type SequenceLoopHandler = (
  generator: SequenceGenerator, loopNth: number
) => void

export type LoopEvent = {
  elapsed?: SequenceLoopHandler
  ended?: SequenceLoopHandler
}

export type MutateStrategy = 'randomize' | 'move' | 'inPlace' | 'recursion'
export type MutateSpec = {
  rate: number
  strategy: MutateStrategy
}
