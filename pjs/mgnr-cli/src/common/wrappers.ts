import { Scale } from 'mgnr-core/src'
import { GeneratorConf, SequenceGenerator } from 'mgnr-core/src/generator/Generator'
import { HarmonizerConf } from 'mgnr-core/src/generator/Harmonizer'
import { ScaleConf } from 'mgnr-core/src/generator/scale/Scale'
import { LogItem } from 'stream/src/types'
import { Range } from 'utils'

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
      r: `${this.pitchRange.min}-${this.pitchRange.max}`
    }
  }
}

export class CliSequenceGenerator extends SequenceGenerator {
  updateDensity(density: GeneratorConf['density']) {
    this.updateConfig({ density })
  }
  useMono() {
    this.updateConfig({ fillPref: 'mono' })
  }
  usePoly() {
    this.updateConfig({ fillPref: 'allowPoly' })
  }
  updateDur(noteDur: GeneratorConf['noteDur']) {
    this.updateConfig({ noteDur })
  }
  updateVel(veloPref: GeneratorConf['veloPref']) {
    this.updateConfig({ veloPref })
  }
  harmonize(...degrees: HarmonizerConf['degree']) {
    this.updateConfig({ harmonizer: { degree: degrees } })
  }
  fill() {
    this.updateConfig({ fillStrategy: 'fill' })
  }
  random() {
    this.updateConfig({ fillStrategy: 'random' })
  }
  randomize(rate: number) {
    this.mutate({rate, strategy: 'randomize'})
  }
  shuffle(rate: number) {
    this.mutate({rate, strategy: 'move'})
  }
  inPlace(rate: number) {
    this.mutate({rate, strategy: 'inPlace'})
  }
  reset() {
    this.resetNotes()
  }
  construct() {
    this.constructNotes()
  }
  get len() {
    return this.sequence.length
  }
  flush() {
    this.eraseSequenceNotes()
    this.loopHandler = undefined
  }
  loopHandler?: (g: CliSequenceGenerator, s: CliScale) => void
  onLoop(cb: typeof CliSequenceGenerator.prototype.loopHandler) {
    this.loopHandler = cb
  }
  execLoop(s: CliScale) {
    try {
      if (!this.loopHandler) return
      this.loopHandler(this, s)
    } catch (err) {
      console.error(`${this.logName}.loopHandler failed `)
      this.loopHandler = undefined
    }
  }

  remove(rate: number) {
    this.sequence.deleteRandomNotes(rate)
  }

  logName: string = ''
  logState(): LogItem {
    return {
      _: this.logName,
      l: this.sequence.length,
      n: this.sequence.numOfNotes,
      den: this.sequence.density,
      dur: convertRange(this.picker.conf.noteDur),
      vel: convertRange(this.picker.conf.noteVel),
      f: this.picker.conf.fillStrategy,
      p: this.sequence.poly ? 'poly' : 'mono',
      h: this.picker.conf.harmonizer ? this.picker.conf.harmonizer['degree'] : '',
    }
  }
}

function convertRange(r: Range | number) {
  if (typeof r === 'number') return r
  else return `${r.min}-${r.max}`
}