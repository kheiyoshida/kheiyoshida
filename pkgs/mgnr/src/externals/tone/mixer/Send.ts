import * as Tone from 'tone'
import { FadeValues, MuteValue } from './Channel'
import Logger from 'js-logger'

export class Sends {
  readonly nodes: Send[] = []

  public push(send: Send) {
    this.nodes.push(send)
  }

  public fade(id: string, values: FadeValues) {
    const s = this.find(id)
    if (s) {
      s.fade(values)
    }
  }

  public mute(id: string, value: MuteValue) {
    const s = this.find(id)
    if (s) {
      s.mute(value)
    }
  }

  private find(to: string): Send | undefined {
    const s = this.nodes.find((n) => n.to === to)
    if (!s) {
      Logger.warn(`could not find send ${to}`)
    }
    return s
  }

  public dispose() {
    this.nodes.forEach(n => n.dispose())
  }
}

export class Send {
  readonly gain: Tone.Gain
  readonly out = new Tone.Channel()

  constructor(amount: number, readonly from: string, readonly to: string) {
    this.gain = new Tone.Gain(amount)
    this.gain.connect(this.out)
  }

  public fade(values: FadeValues) {
    this.gain.gain.rampTo(...values)
  }

  public mute(value: MuteValue) {
    if (value === 'toggle') {
      this.out.mute = !this.out.mute
    } else {
      this.out.mute = value === 'on'
    }
  }

  public dispose() {
    this.gain.dispose()
    this.out.dispose()
  }
}
