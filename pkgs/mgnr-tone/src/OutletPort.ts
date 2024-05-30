import { OutletPort } from 'mgnr-core/src/Outlet'
import { Note } from 'mgnr-core/src/generator/Note'
import { pickRange } from 'utils'
import { ToneOutlet } from './Outlet'
import * as Transport from './tone-wrapper/Transport'
import { scheduleLoop } from './tone-wrapper/utils'

export class ToneOutletPort extends OutletPort<ToneOutlet> {
  /**
   * @note loopNth starts from 1
   */
  protected checkEvent(totalNumOfLoops: number, loopNth: number, loopStartedAt: number) {
    if (this.events.elapsed) {
      this.events.elapsed({
        generator: this.generator,
      })
    }
    if (loopNth === totalNumOfLoops) {
      const actualEndTime = loopStartedAt + totalNumOfLoops * this.sequenceDuration
      if (!this.events.ended) return
      this.events.ended({
        generator: this.generator,
        repeatLoop: (numOfLoops) => this.loopSequence(numOfLoops || totalNumOfLoops, actualEndTime),
      })
    }
  }

  /**
   * Outlet needs to have overhead for time=0 notes
   */
  static BufferTime = 0.05

  public loopSequence(numOfLoops = 1, startTime = 0): ToneOutletPort {
    if (this.generator.sequence.isEmpty) return this
    scheduleLoop(
      (time, loopNth) => {
        this.checkEvent(numOfLoops, loopNth, startTime)
        this.generator.sequence.iterateEachNote((note, position) => {
          this.assignNote(note, time + position * this.secsPerDivision + ToneOutletPort.BufferTime)
        })
      },
      this.sequenceDuration,
      startTime,
      numOfLoops
    )
    return this
  }

  private assignNote(note: Note, time: number): void {
    const pitch = this.getConcretePitch(note)
    const duration = pickRange(note.dur) * this.secsPerDivision
    const velocity = pickRange(note.vel)
    this.outlet.sendNote(pitch, duration, time, velocity)
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
}
