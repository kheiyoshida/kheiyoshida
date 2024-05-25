import { Outlet, OutletPort } from 'mgnr-core/src/Outlet'
import { Note } from 'mgnr-core/src/generator/Note'
import { convertMidiToNoteName } from 'mgnr-core/src/generator/convert'
import { pickRange } from 'utils'
import * as Transport from './tone-wrapper/Transport'
import { scheduleLoop } from './tone-wrapper/utils'
import { ToneInst } from './types'
import { SequenceGenerator } from 'mgnr-core/src/generator/Generator'
import { MonophoniManager, PitchRange } from './Monophonic'

export class ToneOutlet extends Outlet<ToneInst> {
  #mono?: MonophoniManager
  constructor(inst: ToneInst, mono: PitchRange[] | boolean = false) {
    super(inst)
    if (mono !== false) {
      this.#mono = new MonophoniManager(mono === true ? undefined : mono)
    }
  }
  assignNote(pitch: number, duration: number, time: number, velocity: number): void {
    if (this.#mono) {
      const monoNote = this.#mono.register(pitch, time, time + duration)
      if (monoNote === null) return
      duration = monoNote[2] - monoNote[1]
      time = monoNote[1]
    }
    const noteName = convertMidiToNoteName(pitch)
    this.inst.triggerAttackRelease(noteName, duration, time, velocity / 127)
  }
  createPort(generator?: SequenceGenerator): ToneOutletPort {
    return new ToneOutletPort(this, generator)
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
