import { pick } from '../utils/utils'
import { Generator, GeneratorConf } from './generator/Generator'
import { NotePicker } from './generator/NotePicker'
import { Sequence } from './generator/Sequence'

export function createGenerator(conf: GeneratorConf): Generator {
  const picker = new NotePicker(
    pick(conf, ['noteDur', 'noteVel', 'veloPref', 'fillStrategy', 'harmonizer']),
    conf.scale
  )
  const sequence = new Sequence(
    pick(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
  )
  return new Generator(picker, sequence)
}

export function changeSequenceLength(
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
