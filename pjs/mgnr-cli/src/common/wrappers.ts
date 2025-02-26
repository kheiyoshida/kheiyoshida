import { GeneratorConf, Scale, ScaleConf, SequenceConf, SequenceGenerator } from 'mgnr-core'
import { LogItem } from 'stream/src/types'

export class CliScale extends Scale {
  mutateKey(key: ScaleConf['key'], stages = 1) {
    this.modulate({ key }, stages)
  }

  mutateRange(min: number, max: number): void
  mutateRange(cb: (min: number, max: number) => [number, number]): void
  mutateRange(cbOrMin: number | ((min: number, max: number) => [number, number]), max?: number) {
    if (max) {
      this.modulate({ range: { min: cbOrMin as number, max } })
    } else {
      const [min, max] = (cbOrMin as any)(this.pitchRange.min, this.pitchRange.max)
      this.modulate({ range: { min, max } })
    }
  }

  mutatePref(pref: ScaleConf['pref'], stages = 1) {
    this.modulate({ pref }, stages)
  }

  mk(...args: Parameters<typeof CliScale.prototype.mutateKey>) {
    this.mutateKey(...args)
  }

  mp(...args: Parameters<typeof CliScale.prototype.mutatePref>) {
    this.mutatePref(...args)
  }

  logName: string = ''

  logState(): LogItem {
    return {
      _: this.logName,
      k: this.key,
      p: this._conf.pref,
      r: `${this.pitchRange.min}-${this.pitchRange.max}`,
    }
  }
}

class CliSequenceGenerator extends SequenceGenerator {
  updateDensity(density: SequenceConf['density']) {
    this.updateConfig({ sequence: { density } })
  }

  updateDur(duration: number) {
    this.updateConfig({ note: { duration } })
  }

  updateVel(velocity: number) {
    this.updateConfig({ note: { velocity } })
  }

  randomise(rate: number) {
    this.mutate({ strategy: 'randomize', rate })
  }

  shuffle(rate: number) {
    this.mutate({ strategy: 'move', rate })
  }

  inPlace(rate: number) {
    this.mutate({ strategy: 'inPlace', rate })
  }

  useMono() {
    this.updateConfig({ sequence: { polyphony: 'mono' } })
  }

  usePoly() {
    this.updateConfig({ sequence: { polyphony: 'poly' } })
  }

  flush() {
    this.context.sequence.deleteEntireNotes()
  }
}

export const createCliGenerator = (conf: GeneratorConf) => {
  return CliSequenceGenerator.create(conf)
}
