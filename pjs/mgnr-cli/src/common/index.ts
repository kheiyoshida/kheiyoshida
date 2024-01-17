import { GeneratorConf } from 'mgnr-core/src/generator/Generator'
import { NotePicker } from 'mgnr-core/src/generator/NotePicker'
import { Sequence } from 'mgnr-core/src/generator/Sequence'
import { ScaleConf } from 'mgnr-core/src/generator/scale/Scale'
import { getSubset } from 'utils'
import { CliScale, CliSequenceGenerator } from './wrappers'

export function createScale(
  key: ScaleConf['key'],
  pref?: ScaleConf['pref'],
  range?: ScaleConf['range']
): CliScale
export function createScale(conf: Partial<ScaleConf>): CliScale
export function createScale(
  confOrKey?: Partial<ScaleConf> | ScaleConf['key'],
  pref?: ScaleConf['pref'],
  range?: ScaleConf['range']
): CliScale {
  if (typeof confOrKey === 'string') return new CliScale({ key: confOrKey, pref, range })
  else return new CliScale(confOrKey)
}

export function createGenerator(conf: GeneratorConf): CliSequenceGenerator {
  const picker = new NotePicker(
    getSubset(conf, ['noteDur', 'noteVel', 'veloPref', 'fillStrategy', 'harmonizer']),
    conf.scale
  )
  const sequence = new Sequence(
    getSubset(conf, ['length', 'lenRange', 'division', 'density', 'fillPref'])
  )
  return new CliSequenceGenerator(picker, sequence)
}
