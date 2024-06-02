import { GeneratorConf, Middlewares, SequenceGenerator, buildGenerator as createGen } from './Generator'
import { fillNoteConf } from './generator/NotePicker'
import { Sequence } from './generator/Sequence'
import { MidiNum } from './generator/constants'
import { Scale, ScaleConf } from './generator/scale/Scale'

export function createScale(pitches: MidiNum[]): Scale
export function createScale(
  key: ScaleConf['key'],
  pref?: ScaleConf['pref'],
  range?: ScaleConf['range']
): Scale
export function createScale(conf: Partial<ScaleConf>): Scale
export function createScale(
  confOrKeyOrPitches?: Partial<ScaleConf> | ScaleConf['key'] | MidiNum[],
  pref?: ScaleConf['pref'],
  range?: ScaleConf['range']
): Scale {
  if (typeof confOrKeyOrPitches === 'string')
    return new Scale({ key: confOrKeyOrPitches, pref, range })
  if (Array.isArray(confOrKeyOrPitches)) return new Scale(confOrKeyOrPitches)
  return new Scale(confOrKeyOrPitches)
}

export function createGenerator<MW extends Middlewares>(
  conf: GeneratorConf & { middlewares?: MW }
):SequenceGenerator<MW>  {
  const sequence = new Sequence(conf.sequence)
  const picker = fillNoteConf(conf.note || {})
  const scale = conf.scale || new Scale()
  if (!conf.middlewares) return createGen({ picker, sequence, scale }, {} as MW)
  return createGen({ picker, sequence, scale }, conf.middlewares)
}
