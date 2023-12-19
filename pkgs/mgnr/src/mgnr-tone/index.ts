import { MusicGenerator } from '../core'
import { Generator } from '../core/generator/Generator'
import { ToneInst, ToneOutlet } from './Outlet'
import { TimeEventMap, TimeObserver } from './TimeObserver'
import { Mixer } from './mixer/Mixer'

export class ToneMusicGenerator extends MusicGenerator {

  createMixer() {
    return new Mixer({})
  }

  supplyGenerator(gen: Generator, inst: ToneInst): ToneOutlet {
    return new ToneOutlet(gen, inst)
  }

  registerTimeEvents(events: TimeEventMap) {
    new TimeObserver(120).registerEvents(events)
  }
}
