import { MusicGenerator } from '../../core/MusicGenerator'
import { SeqEvent } from '../../core/SequenceEvent'
import { GeneratorConf, construct } from '../../generator/Generator'
import { SequenceNoteMap } from '../../generator/Sequence'
import { ToneDestination } from './Destination'
import { ToneInst } from './SequenceOut'
import { TimeEventMap } from './TimeObserver'
import {
  ChConf,
  FadeValues,
  InstCh,
  InstChannel,
  MuteValue,
  SendCh,
  SendChannel,
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

  assignGenerator(mes: {
    channelId: string
    loop: number
    conf: GeneratorConf
    notes?: SequenceNoteMap
    events?: SeqEvent
  }) {
    const instCh = this.destination.mixer.findInstChannelById(mes.channelId)
    const generator = construct(mes.conf)
    generator.constructNotes(mes.notes)
    this.setSequenceOut(generator, instCh.inst, mes.channelId, mes.loop, mes.events)
  }

  registerTimeEvents(events: TimeEventMap) {
    this.destination.timeObserver.registerEvents(events)
  }

  fadeChannel(channelId: string, values: FadeValues) {
    const ch = this.destination.mixer.findChannelById(channelId)
    ch.volumeFade(values)
  }

  muteChannel(channelId: string, value: MuteValue) {
    this.destination.mixer.muteChannel(channelId, value)
  }

  sendFade(channelId: string, sendId: string, values: FadeValues) {
    this.destination.mixer.fadeChannelSend(channelId, sendId, values)
  }

  sendMute(channel: string, send: string, value: MuteValue) {
    this.destination.mixer.muteChannelSend(channel, send, value)
  }

  disposeChannel(channelId: string) {
    const ch = this.destination.mixer.findChannelById(channelId)
    if (ch instanceof InstChannel) {
      this.disposeSequenceOut(channelId)
    }
    this.deleteChannel(channelId)
  }

  deleteChannel(channelId: string) {
    this.destination.mixer.deleteChannel(channelId)
  }
}
