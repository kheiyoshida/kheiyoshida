import { getSubset } from 'utils'
import { GeneratorConf, SequenceGenerator } from './generator/Generator'
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

export function createGenerator(conf: GeneratorConf): SequenceGenerator {
  const sequence = new Sequence(
    getSubset(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
  )
  return new SequenceGenerator(fillNoteConf(conf), sequence, conf.scale)
}

export function pingpongSequenceLength(initialMethod: 'shrink' | 'extend') {
  let direction = initialMethod
  return (gen: SequenceGenerator, len: number) => {
    gen.changeSequenceLength(direction, len, (method) => {
      direction = method === 'extend' ? 'shrink' : 'extend'
      gen.changeSequenceLength(direction, len)
    })
  }
}
