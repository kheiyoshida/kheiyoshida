import {
  Instrument,
  InstrumentOptions,
} from 'tone/build/esm/instrument/Instrument'
import { FadeValues, InstChannel, MuteValue, SendChannel } from './Channel'
import { MasterChannel, MasterChannelConf } from './Master'
import { Send } from './Send'

export type Inst = Instrument<InstrumentOptions>

export type Channels = {
  inst: { [id: string]: InstChannel }
  sends: { [id: string]: SendChannel }
  master: MasterChannel
}

export class Mixer {
  readonly channels: Channels
  constructor(masterConf: MasterChannelConf) {
    this.channels = {
      inst: {},
      sends: {},
      master: new MasterChannel(masterConf),
    }
  }

  public findInstChannelById(id: string): InstChannel {
    if (this.channels.inst[id]) {
      return this.channels.inst[id]
    } else {
      throw new Error('Channel not found')
    }
  }

  public findChannelById(id: string): InstChannel | SendChannel {
    if (this.channels.inst[id]) {
      return this.channels.inst[id]
    } else if (this.channels.sends[id]) {
      return this.channels.sends[id]
    } else {
      throw new Error('Channel not found')
    }
  }

  public findSendChannelById(id: string): SendChannel {
    if (this.channels.sends[id]) {
      return this.channels.sends[id]
    } else {
      throw new Error('Channel not found')
    }
  }

  public addInstChannel(channelId: string, ch: InstChannel) {
    if (this.channels.inst[channelId]) {
      throw new Error(`Channel already assigned with id ${channelId}`)
    }
    ch.last.connect(this.channels.master.chNode)
    this.channels.inst[channelId] = ch
  }

  public addSendChannel(channelId: string, ch: SendChannel) {
    if (this.channels.sends[channelId]) {
      throw new Error(`Channel already assigned with id ${channelId}`)
    }
    ch.last.connect(this.channels.master.chNode)
    this.channels.sends[channelId] = ch
  }

  public connectSendChannel(from: string, to: string, gainAmount = 0) {
    const fromCh = this.findChannelById(from)
    const toCh = this.findSendChannelById(to)
    const send = new Send(gainAmount, from, to)
    fromCh.connectSend(send)
    send.out.connect(toCh.first)
  }

  public muteChannel(channelId: string, v: MuteValue) {
    const ch = this.findChannelById(channelId)
    ch.mute(v)
  }

  public fadeChannelSend(channelId: string, sendId: string, v: FadeValues) {
    this.findChannelById(channelId).sends.fade(sendId, v)
  }

  public muteChannelSend(channelId: string, sendId: string, v: MuteValue) {
    this.findChannelById(channelId).sends.mute(sendId, v)
  }

  /**
   * delete channel from mixer and dispose channel object.
   * @returns if deleted channel was InstChannel (additional actions required)
   */
  public deleteChannel(channelId: string) {
    const ch = this.findChannelById(channelId)
    const isInstCh = Boolean(ch instanceof InstChannel)
    if (isInstCh) {
      delete this.channels.inst[channelId]
    } else {
      delete this.channels.sends[channelId]
    }
    ch.dispose()
    return isInstCh
  }
}
