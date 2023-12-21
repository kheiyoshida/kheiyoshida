import * as Tone from 'tone'
import { ToneInst } from '../Outlet'
import { Send, Sends } from './Send'

export type ChConf = {
  initialVolume?: number
  effects: Tone.ToneAudioNode[]
}
export type InstChConf<I extends ToneInst = ToneInst> = ChConf & {
  inst: I
}
export type SendChConf = ChConf

export type FadeValues = Parameters<Tone.Param['rampTo']>

export type MuteValue = 'on' | 'off' | 'toggle'

export abstract class Channel {
  readonly effects: Tone.ToneAudioNode[]
  readonly vol: Tone.Volume
  readonly sends = new Sends()

  constructor({ effects, initialVolume }: ChConf) {
    this.effects = effects || []
    this.vol = new Tone.Volume(initialVolume)
  }

  protected connectNodes() {
    let current: Tone.ToneAudioNode = this.first
    if (this.effects && this.effects.length) {
      for (const node of this.effects) {
        current.connect(node)
        current = node
      }
    }
    current.connect(this.vol)
  }

  public connectSend(send: Send) {
    this.last.connect(send.gain)
    this.sends.push(send)
  }

  public volumeFade(values: FadeValues) {
    this.vol.volume.rampTo(...values)
  }

  public mute(v: MuteValue) {
    if (v === 'toggle') {
      this.vol.mute = !this.vol.mute
    } else {
      this.vol.mute = v === 'on'
    }
  }

  public dispose() {
    // don't dispose instrument (in case notes are remaining)
    this.effects.forEach((e) => e.dispose())
    this.sends.dispose()
  }

  abstract get first(): Tone.Channel | ToneInst

  get last(): Tone.ToneAudioNode | ToneInst {
    return this.vol
  }
}

export class InstChannel<I extends ToneInst = ToneInst> extends Channel {
  readonly inst: I

  constructor(conf: InstChConf<I>) {
    super(conf)
    this.inst = conf.inst
    this.connectNodes()
  }

  get first(): ToneInst {
    return this.inst
  }
}

export class SendChannel extends Channel {
  readonly ch = new Tone.Channel()

  constructor(conf: SendChConf) {
    super(conf)
    this.connectNodes()
  }

  get first(): Tone.Channel {
    return this.ch
  }
}
