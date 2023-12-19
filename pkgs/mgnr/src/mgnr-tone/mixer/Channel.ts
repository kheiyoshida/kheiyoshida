import * as Tone from 'tone'
import { ToneInst } from '../Outlet'
import { Send, Sends } from './Send'

export type ChConf<C extends Ch> = C & {
  id: string
  initialVolume?: number
  fadeIn?: FadeValues
}

export type FadeValues = Parameters<Tone.Param['rampTo']>

export type MuteValue = 'on' | 'off' | 'toggle'

export interface Ch {
  effects?: Tone.ToneAudioNode[]
}

export abstract class Channel implements Ch {
  readonly effects: Tone.ToneAudioNode[]
  readonly vol: Tone.Volume
  readonly sends = new Sends()

  constructor({ effects, initialVolume }: Omit<ChConf<Ch>, 'id'>) {
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

export interface InstCh extends Ch {
  inst: ToneInst
}

export class InstChannel extends Channel implements InstCh {
  readonly inst: ToneInst

  constructor(conf: Omit<ChConf<InstCh>, 'id'>) {
    super(conf)
    this.inst = conf.inst
    this.connectNodes()
  }

  get first(): ToneInst {
    return this.inst
  }
}

export interface SendCh extends Ch {
  effects: Tone.ToneAudioNode[]
}

export class SendChannel extends Channel implements SendCh {
  readonly ch = new Tone.Channel()

  constructor(conf: Omit<ChConf<SendCh>, 'id'>) {
    super(conf)
    this.connectNodes()
  }

  get first(): Tone.Channel {
    return this.ch
  }
}
