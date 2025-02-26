import { buildGenerator, SequenceGenerator, GeneratorConf } from './generator/SequenceGenerator'
import { fillNoteConf } from './generator/NotePicker'
import { MidiNum, Sequence, SequenceNoteMap } from './entities'
import { Scale, ScaleConf } from './source'
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
  if (typeof confOrKeyOrPitches === 'string') return new Scale({ key: confOrKeyOrPitches, pref, range })
  if (Array.isArray(confOrKeyOrPitches)) return new Scale(confOrKeyOrPitches)
  return new Scale(confOrKeyOrPitches)
}

/**
 * @deprecated use `SequenceGenerator.create()` factory method
 */
export function createGenerator(
  conf: GeneratorConf & { notes?: SequenceNoteMap }
): SequenceGenerator {
  const sequence = new Sequence(conf.sequence)
  const picker = fillNoteConf(conf.note || {})
  const scale = conf.scale || new Scale()
  const context = { sequence, scale, picker }
  constructNotes(context, conf.notes)
  return buildGenerator(context)
}
