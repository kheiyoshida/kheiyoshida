import { ToneOutlet } from './Outlet'
import { ToneInst } from './types'
import { InstChannel } from './mixer/Channel'
import { MasterChannelConf } from './mixer/Master'
import { Mixer } from './mixer/Mixer'
export { registerEvents as registerTimeEvents } from './timeEvent'


export function getMixer(masterConf: MasterChannelConf = {}) {
  return new Mixer(masterConf)
}

export function createOutlet(inst: ToneInst | InstChannel): ToneOutlet {
  if (inst instanceof InstChannel) return new ToneOutlet(inst.inst)
  else return new ToneOutlet(inst)
}
