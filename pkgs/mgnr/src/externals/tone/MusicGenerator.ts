import { MusicGenerator } from '../../core/MusicGenerator'
import { Generator } from '../../generator/Generator'
import { ToneInst, ToneSequenceOut } from './SequenceOut'
import { TimeEventMap, TimeObserver } from './TimeObserver'
import { Mixer } from './mixer/Mixer'

export class ToneMusicGenerator extends MusicGenerator {

  createMixer() {
    return new Mixer({})
  }

  supplyGenerator(gen: Generator, inst: ToneInst): ToneSequenceOut {
    return new ToneSequenceOut(gen, inst)
  }

  registerTimeEvents(events: TimeEventMap) {
    new TimeObserver(120).registerEvents(events)
  }
}
