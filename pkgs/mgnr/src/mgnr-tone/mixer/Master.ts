import Logger from 'js-logger'
import * as Tone from 'tone'
import { overrideDefault } from 'utils'

export interface MasterChannelConf {
  limitThreashold?: number
  autoLimit?: boolean
  targetRMS?: number
  comp?: Tone.Compressor
}

export class MasterChannel {
  static getDefault() {
    return {
      limitThreashold: -6,
      autoLimit: true,
      targetRMS: -6,
    }
  }

  readonly chNode: Tone.Channel
  readonly gainNode: Tone.Gain
  readonly comp: Tone.Compressor
  readonly limiter: Tone.Limiter
  readonly meter: Tone.Meter
  readonly vol: Tone.Volume

  constructor(options: MasterChannelConf = {}) {
    const { limitThreashold, autoLimit, targetRMS } = overrideDefault(
      MasterChannel.getDefault(),
      options
    )
    this.chNode = new Tone.Channel()
    this.gainNode = new Tone.Gain(4)
    this.comp = new Tone.Compressor({ threshold: 0 })
    this.limiter = new Tone.Limiter(limitThreashold)
    this.meter = new Tone.Meter()
    this.vol = new Tone.Volume(-6)
    const dest = Tone.getDestination()
    this.chNode.chain(
      this.gainNode,
      this.comp,
      this.limiter,
      this.meter,
      this.vol,
      dest
    )
    if (autoLimit) {
      this.autoLimit(targetRMS)
    }
  }

  private autoLimit(targetRMS: number) {
    setInterval(() => {
      const r = this.meter.getValue() as number
      if (r > targetRMS) {
        Logger.warn('RMS exceeded threashold. adjusting...')
        this.limiter.threshold.value -= 1
        this.gainNode.gain.rampTo(this.gainNode.gain.value - 1, 1)
      }
    }, 100)
  }
}
