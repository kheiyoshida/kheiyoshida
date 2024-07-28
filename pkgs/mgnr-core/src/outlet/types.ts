import { Middlewares, SequenceGenerator } from '../generator/Generator'

export type LoopEventKey = 'elapsed' | 'ended'

export type SequenceLoopHandler<GMW extends Middlewares> = (
  generator: SequenceGenerator<GMW>,
  loopNth: number
) => void

export type LoopEvent<GMW extends Middlewares> = {
  elapsed?: SequenceLoopHandler<GMW>
  ended?: SequenceLoopHandler<GMW>
}
