import { Outlet, OutletPort } from 'mgnr-core/src/Outlet'
import { SequenceGenerator } from 'mgnr-core/src/generator/Generator'
import { Note } from 'mgnr-core/src/generator/Note'
import { convertMidiToNoteName } from 'mgnr-core/src/generator/convert'
import { pickRange } from 'utils'
import { LayeredNoteBuffer, NoteBuffer } from './Buffer'
import { LayeredInstrument } from './instrument'
import * as Transport from './tone-wrapper/Transport'
import { scheduleLoop } from './tone-wrapper/utils'
import { ToneInst } from './types'

export class ToneOutlet extends Outlet<ToneInst> {
  assignNote(pitch: number, duration: number, time: number, velocity: number): void {
    this.triggerNote(pitch, duration, time, velocity)
  }
  protected triggerNote(pitch: number, duration: number, time: number, velocity: number): void {
    const noteName = convertMidiToNoteName(pitch)
    this.inst.triggerAttackRelease(noteName, duration, time, velocity / 127)
  }
  createPort(generator?: SequenceGenerator): ToneOutletPort {
    return new ToneOutletPort(this, generator)
  }
}

export class MonoOutlet extends ToneOutlet {
  #buffer: NoteBuffer
  constructor(inst: ToneInst, bufferTimeFrame: number = Transport.toSeconds('16n')) {
    super(inst)
    this.#buffer = new NoteBuffer(bufferTimeFrame)
    Transport.scheduleRepeat((time) => {
      const notes = this.#buffer!.consume(time)
      if (!notes.length) return
      const note = notes[0] // only use one at a time
      this.triggerNote(note.pitch, note.duration, time, note.velocity)
    }, bufferTimeFrame)
  }
  assignNote(pitch: number, duration: number, time: number, velocity: number): void {
    this.#buffer.insert({ pitch, duration, time, velocity })
  }
}

export class LayeredOutlet extends ToneOutlet {
  #buffer: LayeredNoteBuffer
  constructor(inst: LayeredInstrument, bufferTimeFrame: number = Transport.toSeconds('16n')) {
    super(inst)
    this.#buffer = new LayeredNoteBuffer(bufferTimeFrame, inst.instruments)
    Transport.scheduleRepeat((time) => {
      const noteGroups = this.#buffer!.consume(time)
      noteGroups.forEach((notes) => {
        if (!notes.length) return
        const note = notes[0] // only use one at a time
        this.triggerNote(note.pitch, note.duration, time, note.velocity)
      })
    }, bufferTimeFrame)
  }
  assignNote(pitch: number, duration: number, time: number, velocity: number): void {
    this.#buffer.insert({ pitch, duration, time, velocity })
  }
}

export class ToneOutletPort extends OutletPort<ToneOutlet> {
  protected checkEvent(totalNumOfLoops: number, loopNth: number, loopStartedAt: number) {
    if (this.events.elapsed) {
      this.events.elapsed({
        out: this,
        loop: loopNth,
        endTime: loopStartedAt + loopNth * this.sequenceDuration,
      })
    }
    if (loopNth === totalNumOfLoops) {
      this.cancelAssign()
      const actualEndTime = loopStartedAt + totalNumOfLoops * this.sequenceDuration
      if (this.events.ended) {
        this.events.ended({
          out: this,
          loop: totalNumOfLoops,
          endTime: actualEndTime,
          repeatLoop: () => this.loopSequence(totalNumOfLoops, actualEndTime),
        })
      }
    }
  }

  private loopIds: number[] = []
  public loopSequence(numOfLoops = 1, startTime = 0): ToneOutletPort {
    if (this.generator.sequence.isEmpty) return this
    const e = scheduleLoop(
      (time, loopNth) => {
        this.checkEvent(numOfLoops, loopNth, startTime)
        this.generator.sequence.iterateEachNote((note, position) => {
          this.assignNote(note, time + position * this.secsPerDivision)
        })
      },
      this.sequenceDuration,
      startTime,
      numOfLoops
    )
    this.loopIds.push(e)
    return this
  }

  private assignNote(note: Note, time: number): void {
    const pitch = this.getConcretePitch(note)
    const duration = pickRange(note.dur) * this.secsPerDivision
    const velocity = pickRange(note.vel)
    this.outlet.assignNote(pitch, duration, time, velocity)
  }

  private getConcretePitch(note: Note): number {
    return note.pitch === 'random'
      ? this.generator.picker.scale.pickRandomPitch() // violation of law of demeter
      : note.pitch
  }

  private get secsPerMeasure() {
    return Transport.toSeconds('1m')
  }

  private get sequenceDuration() {
    return this.generator.sequence.numOfMeasures * this.secsPerMeasure
  }

  private get secsPerDivision() {
    return this.secsPerMeasure / this.generator.sequence.division
  }

  public cancelAssign() {
    this.loopIds.forEach((id) => Transport.clear(id))
    this.loopIds = []
  }
}
