import * as CoreEvents from '../core/events'
import { CoreHandler, Event } from '../core/Message'

export type SeqEventKey = 'assigned' | 'started' | 'elapsed' | 'ended'
export type SeqEventDef<E extends Event> = CoreHandler<E> | MutateSpec | Event[]
export type SeqEvent = {
  elapsed?: SeqEventDef<CoreEvents.SequenceElapsed>
  ended?: SeqEventDef<CoreEvents.SequenceEnded>
}

export type MutateStrategy = 'randomize' | 'move' | 'inPlace' | 'recursion'
export type MutateSpec = {
  rate: number
  strategy: MutateStrategy
}