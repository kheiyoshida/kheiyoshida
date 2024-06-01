import {
  GeneratorConf,
  Middlewares,
  SequenceGenerator,
  createGenerator as createGen,
} from './generator/Generator'
import { fillNoteConf } from './generator/NotePicker'
import { Sequence } from './generator/Sequence'
import { Scale, ScaleConf } from './generator/scale/Scale'

export function createScale(
  key: ScaleConf['key'],
  pref?: ScaleConf['pref'],
  range?: ScaleConf['range']
): Scale
export function createScale(conf: Partial<ScaleConf>): Scale
export function createScale(
  confOrKey?: Partial<ScaleConf> | ScaleConf['key'],
  pref?: ScaleConf['pref'],
  range?: ScaleConf['range']
): Scale {
  if (typeof confOrKey === 'string') return new Scale({ key: confOrKey, pref, range })
  else return new Scale(confOrKey)
}

export function createGenerator<MW extends Middlewares>(
  conf: GeneratorConf & { middlewares?: MW }
): SequenceGenerator<MW> {
  const sequence = new Sequence(conf.sequence)
  const picker = fillNoteConf(conf.note || {})
  return createGen({ picker, sequence, scale: conf.scale || new Scale() }, conf.middlewares)
}
