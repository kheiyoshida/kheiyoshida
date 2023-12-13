import * as Tone from 'tone'
import * as Events from '../../core/events'
import { convertMidiToNoteName } from '../../generator/convert'
import { SequenceOut } from '../../core/SequenceOut'
import {
  Instrument,
  InstrumentOptions,
} from 'tone/build/esm/instrument/Instrument'
import { Note } from '../../generator/Note'
import { pickRange } from '../../utils/calc'
import Logger from 'js-logger'

export type ToneInst = Instrument<InstrumentOptions>

export class ToneSequenceOut extends SequenceOut<ToneInst> {
  /**
   * Check time based events while assign loop
   */
  private checkEvent(loop: number, repeatNth: number, loopStartedAt: number) {
    if (this.events.elapsed) {
      Events.SequenceElapsed.pub({
        out: this,
        loop: repeatNth,
        endTime: loopStartedAt + repeatNth * this.sequenceDuration,
      })
    }
    if (repeatNth === loop) {
      Events.SequenceEnded.pub({
        out: this,
        loop,
        endTime: loopStartedAt + loop * this.sequenceDuration,
      })
    }
  }

  /**
   * @param loop number of loop
   * @param startTime time elapsed in Tone.Transport
   */
  public assignSequence(loop = 1, startTime = 0) {
    if (this.isDisposed) return
    if (this.generator.sequence.isEmpty) return
    let repeat = 0
    const e = Tone.Transport.scheduleRepeat(
      (t) => {
        repeat += 1
        this.checkEvent(loop, repeat, startTime)
        this.generator.sequence.iterate((note, pos) => {
          this.assignNote(note, t + pos * this.secsPerDiv)
        })
      },
      this.sequenceDuration, // interval
      startTime, // start
      loop * this.sequenceDuration // loop duration
    )
    this.assignIds.push(e)
  }

  private assignNote(note: Note, time: number) {
    const pitch = this.finalPitch(note)
    if (!pitch) {
      Logger.debug('canceled assigning note due to empty scale')
    } else {
      this.inst.triggerAttackRelease(
        convertMidiToNoteName(pitch),
        pickRange(note.dur) * this.secsPerDiv,
        time,
        pickRange(note.vel) / 127
      )
    }
  }

  private finalPitch(note: Note) {
    return note.pitch === 'random'
      ? this.generator.picker.scale.pickRandomPitch()
      : note.pitch
  }

  private get secsPerMeasure() {
    return Tone.Transport.toSeconds('1m')
  }

  private get sequenceDuration() {
    return this.generator.sequence.lengthInMeasure * this.secsPerMeasure
  }

  private get secsPerDiv() {
    return this.secsPerMeasure / this.generator.sequence.division
  }

  private assignIds: number[] = []

  public cancelAssign() {
    this.assignIds.forEach((id) => Tone.Transport.clear(id))
  }

  public dispose() {
    super.dispose()
    this.cancelAssign()
  }
}
