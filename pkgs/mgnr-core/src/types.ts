import { Middlewares, SequenceGenerator } from './Generator'

export type LoopEventKey = 'elapsed' | 'ended'

export type SequenceLoopHandler<GMW extends Middlewares> = (
  generator: SequenceGenerator<GMW>, loopNth: number
) => void

export type LoopEvent<GMW extends Middlewares> = {
  elapsed?: SequenceLoopHandler<GMW>
  ended?: SequenceLoopHandler<GMW>
}

export type MutateStrategy = 'randomize' | 'move' | 'inPlace' | 'recursion'
export type MutateSpec = {
  rate: number
  strategy: MutateStrategy
}
