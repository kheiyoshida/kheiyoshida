import { Command } from '../../core/Message'
import { SeqEvent } from '../../core/SequenceEvent'
import { GeneratorConf } from '../../generator/Generator'
import { SequenceNoteMap } from '../../generator/Sequence'
import { TimeEventMap } from './TimeObserver'
import { ChConf, InstCh, SendCh } from './mixer/Channel'

export class SetupInstChannel extends Command {
  conf!: ChConf<InstCh>
}

export class SetupSendChannel extends Command {
  conf!: ChConf<SendCh>
}

export class AssignSendChannel extends Command {
  from!: string
  to!: string
  gainAmount = 0
}

/**
 * create and assign `Generator` to inst
 *
 * @param length
 * how long a sequence should be.
 * unit is defined by generator's division.
 * if length = 24 and generator.division = 16, a sequence lasts for 1.5 measure
 *
 * @param loop
 * how many times generated sequence have to loop.
 */
export class AssignGenerator extends Command implements GeneratorConf {
  channelId!: string
  loop!: number
  conf!: GeneratorConf['conf']
  notes?: SequenceNoteMap
  events?: SeqEvent
}

export class RegisterTimeEvents extends Command {
  events!: TimeEventMap
}
