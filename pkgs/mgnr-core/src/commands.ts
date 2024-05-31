import { getSubset } from 'utils'
import { GeneratorConf, createGenerator as createGen } from './generator/Generator'
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

export function createGenerator(conf: GeneratorConf) {
  const sequence = new Sequence(
    getSubset(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
  )
  const picker = fillNoteConf(conf)
  return createGen({ picker, sequence, scale: conf.scale || new Scale() })
}
