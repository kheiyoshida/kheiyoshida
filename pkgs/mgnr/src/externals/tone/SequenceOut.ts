import * as Transport from './tone-wrapper/Transport'
import * as Events from '../../core/events'
import { convertMidiToNoteName } from '../../generator/convert'
import { SequenceOut } from '../../core/SequenceOut'
import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument'
import { Note } from '../../generator/Note'
import { pickRange } from '../../utils/calc'
import Logger from 'js-logger'

export type ToneInst = Instrument<InstrumentOptions>

export class ToneSequenceOut extends SequenceOut<ToneInst> {
  /**
   * ids of assign events
   */
  private assignIds: number[] = []

  protected checkEvent(repeat: number, repeatNth: number, loopStartedAt: number) {
    if (this.events.elapsed) {
      Events.SequenceElapsed.pub({
        out: this,
        loop: repeatNth,
        endTime: loopStartedAt + repeatNth * this.sequenceDuration,
      })
    }
    if (repeatNth === repeat) {
      Events.SequenceEnded.pub({
        out: this,
        loop: repeat,
        endTime: loopStartedAt + repeat * this.sequenceDuration,
      })
    }
  }

  /**
   * @param startTime time elapsed in Tone.Transport
   */
  public assignSequence(repeat = 1, startTime = 0) {
    if (this.isDisposed) return
    if (this.generator.sequence.isEmpty) return
    const e = Transport.scheduleLoop(
      (time, loopNth) => {
        this.checkEvent(repeat, loopNth, startTime)
        this.generator.sequence.iterate((note, pos) => {
          this.assignNote(note, time + pos * this.secsPerDivision)
        })
      },
      this.sequenceDuration,
      startTime,
      repeat
    )
    this.assignIds.push(e)
  }

  private assignNote(note: Note, time: number) {
    const pitch = this.getConcretePitch(note)
    if (!pitch) {
      Logger.debug('canceled assigning note due to empty scale')
    } else {
      this.inst.triggerAttackRelease(
        convertMidiToNoteName(pitch),
        pickRange(note.dur) * this.secsPerDivision,
        time,
        pickRange(note.vel) / 127
      )
    }
  }

  private getConcretePitch(note: Note) {
    return note.pitch === 'random'
      ? this.generator.picker.scale.pickRandomPitch() // violation of law of demeter
      : note.pitch
  }

  private get secsPerMeasure() {
    return Transport.toSeconds('1m')
  }

  private get sequenceDuration() {
    return this.generator.sequence.lengthInMeasure * this.secsPerMeasure
  }

  private get secsPerDivision() {
    return this.secsPerMeasure / this.generator.sequence.division
  }

  public cancelAssign() {
    this.assignIds.forEach((id) => Transport.clear(id))
  }

  public dispose() {
    super.dispose()
    this.cancelAssign()
  }
}
