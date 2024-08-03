import { ScaleConf } from 'mgnr-core'
import { CliScale } from './wrappers'

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

