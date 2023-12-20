import { ToneInst, ToneOutlet } from './Outlet'
import { TimeEventMap, registerEvents } from './timeEvent'
import { Mixer } from './mixer/Mixer'
import { InstChannel } from './mixer/Channel'

export function createMixer() {
  return new Mixer({})
}

export function createOutlet(inst: ToneInst | InstChannel): ToneOutlet {
  if (inst instanceof InstChannel) return new ToneOutlet(inst.inst)
  else return new ToneOutlet(inst)
}

export function registerTimeEvents(events: TimeEventMap) {
  registerEvents(events)
}
