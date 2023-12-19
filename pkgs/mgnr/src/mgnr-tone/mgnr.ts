import { Generator } from '../core/generator/Generator'
import { ToneInst, ToneOutlet } from './Outlet'
import { TimeEventMap, TimeObserver } from './TimeObserver'
import { Mixer } from './mixer/Mixer'

export function createMixer() {
  return new Mixer({})
}

export function supplyGenerator(gen: Generator, inst: ToneInst): ToneOutlet {
  return new ToneOutlet(gen, inst)
}

export function registerTimeEvents(events: TimeEventMap) {
  new TimeObserver(120).registerEvents(events)
}
