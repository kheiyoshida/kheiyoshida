import { fireByRate } from 'utils'
import { MutateSpec } from '../types'
import {
  NotePickerConf,
  adjustNotePitch,
  changeNotePitch,
  harmonizeNote,
  pickHarmonizedNotes,
} from './NotePicker'
import { Sequence, SequenceConf, SequenceNoteMap } from './Sequence'
import { Scale } from './scale/Scale'

export type GeneratorConf = {
  scale?: Scale
} & Partial<SequenceConf> &
  Partial<NotePickerConf>

type GeneratorContext = {
  sequence: Sequence
  picker: NotePickerConf
  scale: Scale
}

export class SequenceGenerator {
  picker: NotePickerConf
  readonly sequence: Sequence

  get notes(): SequenceNoteMap {
    return this.sequence.notes
  }

  constructor(
    picker: NotePickerConf,
    sequence: Sequence,
    readonly scale: Scale = new Scale()
  ) {
    this.picker = picker
    this.sequence = sequence
  }

  private getContext(): GeneratorContext {
    return {
      sequence: this.sequence,
      picker: this.picker,
      scale: this.scale,
    }
  }

  public updateConfig(config: Partial<GeneratorConf>): void {
    this.sequence.updateConfig(config)
    this.picker = { ...this.picker, ...config }
    this.constructNotes()
  }

  public constructNotes(initialNotes?: SequenceNoteMap) {
    const context = this.getContext()
    assignInitialNotes(context, initialNotes)
    assignNotes(context)
  }

  public resetNotes(notes?: SequenceNoteMap) {
    const context = this.getContext()
    eraseSequenceNotes(context)
    assignInitialNotes(context, notes)
    removeNotesOutOfLength(context.sequence)
    adjustPitch(context)
    assignNotes(context)
  }

  public eraseSequenceNotes() {
    eraseSequenceNotes(this.getContext())
  }

  public adjustPitch() {
    adjustPitch(this.getContext())
  }

  public changeSequenceLength(
    method: 'shrink' | 'extend',
    length: number,
    onSequenceLengthLimit: (currentMethod: 'shrink' | 'extend') => void = () => undefined
  ) {
    changeSequenceLength(this.getContext(), method, length, onSequenceLengthLimit)
  }

  public mutate(spec: MutateSpec) {
    mutate(this.getContext(), spec)
  }
}

const resetNotes = (context: GeneratorContext) => (notes?: SequenceNoteMap) => {
  eraseSequenceNotes(context)
  assignInitialNotes(context, notes)
  removeNotesOutOfLength(context.sequence)
  adjustPitch(context)
  assignNotes(context)
}

function assignInitialNotes(context: GeneratorContext, initialNotes?: SequenceNoteMap) {
  if (!initialNotes) return
  Sequence.iteratePosition(initialNotes, (position) => {
    context.sequence.addNotes(
      position,
      context.picker.harmonizer
        ? initialNotes[position].flatMap((note) => [
            note,
            ...harmonizeNote(note, context.picker, context.scale),
          ])
        : initialNotes[position]
    )
  })
}

function eraseSequenceNotes({ sequence }: GeneratorContext) {
  sequence.deleteEntireNotes()
}

function adjustPitch({ sequence, scale, picker }: GeneratorContext) {
  sequence.iterateEachNote((n) => {
    adjustNotePitch(n, scale, picker)
  })
}

function changeSequenceLength(
  context: GeneratorContext,
  method: 'shrink' | 'extend',
  length: number,
  onSequenceLengthLimit: (currentMethod: 'shrink' | 'extend') => void = () => undefined
) {
  if (method === 'extend') {
    if (!context.sequence.canExtend(length)) return onSequenceLengthLimit(method)
    extend(context, length)
  } else {
    if (!context.sequence.canShrink(length)) return onSequenceLengthLimit(method)
    shrink(context, length)
  }
}

function extend(context: GeneratorContext, length: number) {
  context.sequence.extend(length)
  assignNotes(context)
}

function shrink(context: GeneratorContext, length: number) {
  context.sequence.shrink(length)
  removeNotesOutOfLength(context.sequence)
}

function removeNotesOutOfLength(sequence: Sequence) {
  sequence.iteratePosition((p) => {
    if (p >= sequence.length) {
      sequence.deleteNotesInPosition(p)
    }
  })
}

function mutate(context: GeneratorContext, { rate, strategy }: MutateSpec) {
  switch (strategy) {
    case 'randomize':
      randomizeNotes(context, rate)
      break
    case 'move':
      moveNotes(context, rate)
      break
    case 'inPlace':
      mutateNotesPitches(context, rate)
      break
  }
}

function randomizeNotes(context: GeneratorContext, rate: number) {
  context.sequence.deleteRandomNotes(rate)
  assignNotes(context)
}

function assignNotes(context: GeneratorContext) {
  switch (context.picker.fillStrategy) {
    case 'random':
    case 'fill':
      fillAvailableSpaceInSequence(context)
      break
    case 'fixed':
      break
  }
}

function fillAvailableSpaceInSequence({ sequence, picker, scale }: GeneratorContext) {
  let fail = 0
  while (sequence.availableSpace > 0 && fail < 5) {
    const notes = pickHarmonizedNotes(picker, scale)
    if (!notes) {
      fail += 1
    } else {
      const pos = sequence.getAvailablePosition()
      sequence.addNotes(pos, notes)
    }
  }
}

function moveNotes({ sequence }: GeneratorContext, rate: number) {
  sequence.deleteRandomNotes(rate).forEach((n) => {
    const pos = sequence.getAvailablePosition()
    sequence.addNote(pos, n)
  })
}

function mutateNotesPitches({ sequence, scale }: GeneratorContext, rate: number) {
  sequence.iterateEachNote((n) => {
    if (fireByRate(rate)) {
      changeNotePitch(n, scale)
    }
  })
}
