import { Outlet } from 'mgnr-core/src/Outlet'
import { Note } from 'mgnr-core/src/generator/Note'
import { convertMidiToNoteName } from 'mgnr-core/src/generator/convert'
import { pickRange } from 'utils'
import * as Transport from './tone-wrapper/Transport'
import { scheduleLoop } from './tone-wrapper/utils'
import { ToneInst } from './instrument/types'

export class ToneOutlet extends Outlet<ToneInst> {
  /**
   * ids of assign events
   */
  private assignIds: number[] = []

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

  /**
   * @param startTime time elapsed in Tone.Transport
   */
  public loopSequence(numOfLoops = 1, startTime = 0): ToneOutlet {
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
    this.assignIds.push(e)
    return this
  }

  private assignNote(note: Note, time: number): void {
    const pitch = this.getConcretePitch(note)
    this.inst.triggerAttackRelease(
      convertMidiToNoteName(pitch),
      pickRange(note.dur) * this.secsPerDivision,
      time,
      pickRange(note.vel) / 127
    )
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
    this.assignIds.forEach((id) => Transport.clear(id))
    this.assignIds = []
  }
}
