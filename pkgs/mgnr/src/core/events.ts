import { Scale, ScaleConf } from '../generator/Scale'
import { Generator } from '../generator/Generator'
import { Event } from './Message'
import { SeqEvent } from './SequenceEvent'
import { SequenceOut } from './SequenceOut'

export class SequenceOutSetupRequired<I = any> extends Event {
  gen!: Generator
  inst!: I
  outId!: string
  loop?: number
  events?: SeqEvent
}

export class SequenceLengthChangeRequired extends Event {
  gen!: Generator
  method!: 'shrink' | 'extend'
  len!: number
  refill?: boolean = true
  exceeded?: 'reverse' | 'erase'
}

export class EraseNotesRequired extends Event {
  gen!: Generator
}

export class ScaleModulationRequired extends Event {
  scale!: Scale
  next!: Partial<ScaleConf>
  stages?: number = 0
}

export class AdjustNotesRequired extends Event {
  scale!: Scale
}



export class SequenceReAssignRequired extends Event {
  out!: SequenceOut
  startTime!: number
  loop?: number
  reset?: boolean
}

export class DisposeSequenceOutRequired extends Event {
  outId!: string
}