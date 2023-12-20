import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument'
import { ChConf, Channel, FadeValues, InstCh, InstChannel, MuteValue, SendCh, SendChannel } from './Channel'
import { MasterChannel, MasterChannelConf } from './Master'
import { Send } from './Send'
import { removeItemFromArray } from 'utils/src/utils/mutate'

export type Inst = Instrument<InstrumentOptions>

export class Mixer {
  readonly channels: Channel[] = []
  readonly master: MasterChannel

  constructor(masterConf: MasterChannelConf = {}) {
    this.master = new MasterChannel(masterConf)
  }

  createInstChannel(conf: ChConf<InstCh>) {
    const newCh = new InstChannel(conf)
    this.registerChannel(newCh)
    if (conf.fadeIn) {
      newCh.volumeFade(conf.fadeIn)
    }
    return newCh
  }

  createSendChannel(conf: ChConf<SendCh>) {
    const newCh = new SendChannel(conf)
    this.registerChannel(newCh)
    return newCh
  }

  connectSendChannel(fromCh: Channel, toCh: SendChannel, gainAmount = 0) {
    const send = new Send(gainAmount, fromCh, toCh)
    fromCh.connectSend(send)
    send.out.connect(toCh.first)
  }

  private registerChannel(channel: Channel) {
    if (this.channels.includes(channel)) {
      throw Error(`channel ${channel} alredy registered`)
    }
    channel.last.connect(this.master.chNode)
    this.channels.push(channel)
  }

  public fadeChannelSend(fromCh: Channel, toCh: SendChannel, v: FadeValues) {
    fromCh.sends.find(toCh).fade(v)
  }

  public muteChannelSend(fromCh: Channel, toCh: SendChannel, v: MuteValue) {
    fromCh.sends.find(toCh).mute(v)
  }

  public deleteChannel(channel: Channel) {
    removeItemFromArray(this.channels, channel)
    channel.dispose()
  }
}
