import { Generator, GeneratorConf } from './generator/Generator'
import { NotePicker } from './generator/NotePicker'
import { Scale, ScaleConf } from './generator/Scale'
import { Sequence } from './generator/Sequence'
import { pick } from '../utils/utils'

export class MusicGenerator {
  private generators: Generator[] = []

  createGenerator(conf: GeneratorConf): Generator {
    const picker = new NotePicker(
      pick(conf, ['noteDur', 'noteVel', 'veloPref', 'fillStrategy', 'harmonizer']),
      conf.scale
    )
    const sequence = new Sequence(
      pick(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
    )
    const generator = new Generator(picker, sequence)
    this.generators.push(generator)
    return generator
  }

  changeSequenceLength(
    gen: Generator,
    method: 'shrink' | 'extend',
    len: number,
    exceeded?: 'reverse' | 'erase',
    refill = true
  ) {
    const result = gen.changeSequenceLength(method, len, refill)
    if (result === false) {
      if (exceeded === 'reverse') {
        gen.toggleReverse()
        gen.changeSequenceLength(method, len, refill)
      } else if (exceeded === 'erase') {
        gen.eraseSequenceNotes()
      }
    }
  }

  modulateScale(scale: Scale, next: Partial<ScaleConf>, stages = 0) {
    scale.modulate(next, stages)
    this.adjustPitch(scale)
  }

  adjustPitch(scale: Scale) {
    const gens = this.generators.filter((gen) => gen.scale === scale)
    gens.forEach((gen) => gen.adjustPitch())
  }
}
