import { MusicGenerator } from '../../core/MusicGenerator'
import { Generator } from '../../generator/Generator'
import { ToneDestination } from './Destination'
import { ToneInst, ToneSequenceOut } from './SequenceOut'
import { TimeEventMap } from './TimeObserver'
import {
  ChConf,
  InstCh,
  InstChannel
} from './mixer/Channel'
import { Mixer } from './mixer/Mixer'

export class ToneMusicGenerator extends MusicGenerator<ToneDestination, ToneInst> {
  constructor(dest?: ToneDestination) {
    super(dest || new ToneDestination())
  }

  createMixer() {
    return new Mixer({})
  }

  setupInstChannel(conf: ChConf<InstCh>) {
    this.destination.mixer.createInstChannel(conf)
  }

  assignSendChannel(from: string, to: string, gainAmount = 0) {
    this.destination.mixer.connectSendChannel(from, to, gainAmount)
  }

  supplyGenerator(gen: Generator, inst: ToneInst): ToneSequenceOut {
    return new ToneSequenceOut(gen, inst)
  }

  registerTimeEvents(events: TimeEventMap) {
    this.destination.timeObserver.registerEvents(events)
  }

  disposeChannel(channelId: string) {
    const ch = this.destination.mixer.findChannelById(channelId)
    if (ch instanceof InstChannel) {
      this.disposeSequenceOut(channelId)
    }
    this.destination.mixer.deleteChannel(channelId)
  }
}
