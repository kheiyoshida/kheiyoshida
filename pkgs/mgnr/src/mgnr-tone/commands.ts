
import { ToneInst, ToneOutlet } from './Outlet'
import { TimeEventMap, TimeObserver } from './TimeObserver'
import { Mixer } from './mixer/Mixer'

export function createMixer() {
  return new Mixer({})
}

export function createOutlet(inst: ToneInst): ToneOutlet {
  return new ToneOutlet(inst)
}

export function registerTimeEvents(events: TimeEventMap) {
  new TimeObserver(120).registerEvents(events)
}
