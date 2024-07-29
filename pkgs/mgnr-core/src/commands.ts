import { GeneratorConf, Middlewares, SequenceGenerator, buildGenerator } from './generator/Generator'
import { fillNoteConf } from './generator/NotePicker'
import { Sequence, SequenceNoteMap } from './entities/Sequence'
import { MidiNum } from './entities/pitch/constants'
import { Scale, ScaleConf } from './source/Scale'
import { constructNotes } from './generator/middleware'

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
  conf: GeneratorConf & { middlewares?: MW } & { notes?: SequenceNoteMap }
): SequenceGenerator<MW> {
  const sequence = new Sequence(conf.sequence)
  const picker = fillNoteConf(conf.note || {})
  const scale = conf.scale || new Scale()
  constructNotes({sequence, scale, picker}, conf.notes)
  const generator = conf.middlewares
    ? buildGenerator({ picker, sequence, scale }, conf.middlewares)
    : buildGenerator({ picker, sequence, scale }, {} as MW)
  return generator
}
