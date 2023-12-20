import { ToneInst, ToneOutlet } from './Outlet'
import { TimeEventMap, registerEvents } from './timeEvent'
import { Mixer } from './mixer/Mixer'

export function createMixer() {
  return new Mixer({})
}

export function createOutlet(inst: ToneInst): ToneOutlet {
  return new ToneOutlet(inst)
}

export function registerTimeEvents(events: TimeEventMap) {
  registerEvents(events)
}
