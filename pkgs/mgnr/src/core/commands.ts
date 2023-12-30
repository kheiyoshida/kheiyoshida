import { pick } from '../utils/utils'
import { SequenceGenerator, GeneratorConf } from './generator/Generator'
import { NotePicker } from './generator/NotePicker'
import { Scale, ScaleConf } from './generator/scale/Scale'
import { Sequence } from './generator/Sequence'

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
  const picker = new NotePicker(
    pick(conf, ['noteDur', 'noteVel', 'veloPref', 'fillStrategy', 'harmonizer']),
    conf.scale
  )
  const sequence = new Sequence(
    pick(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
  )
  return new SequenceGenerator(picker, sequence)
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
