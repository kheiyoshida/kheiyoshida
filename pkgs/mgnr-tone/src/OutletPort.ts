import { OutletPort } from 'mgnr-core/src/Outlet'
import { Note } from 'mgnr-core/src/generator/Note'
import { pickRange } from 'utils'
import * as Transport from './tone-wrapper/Transport'
import { scheduleLoop } from './tone-wrapper/utils'
import { ToneOutlet } from './Outlet'

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
