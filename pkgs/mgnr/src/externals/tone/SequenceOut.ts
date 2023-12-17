import Logger from 'js-logger'
import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument'
import { SequenceOut } from '../../core/SequenceOut'
import * as Events from '../../core/events'
import { Note } from '../../generator/Note'
import { convertMidiToNoteName } from '../../generator/convert'
import { pickRange } from '../../utils/calc'
import * as Transport from './tone-wrapper/Transport'
import { scheduleLoop } from './tone-wrapper/utils'

export type ToneInst = Instrument<InstrumentOptions>

export class ToneSequenceOut extends SequenceOut<ToneInst> {
  /**
   * ids of assign events
   */
  private assignIds: number[] = []

  protected checkEvent(totalNumOfLoops: number, loopNth: number, loopStartedAt: number) {
    if (this.events.elapsed) {
      Events.SequenceElapsed.pub({
        out: this,
        loop: loopNth,
        endTime: loopStartedAt + loopNth * this.sequenceDuration,
      })
    }
    if (loopNth === totalNumOfLoops) {
      Events.SequenceEnded.pub({
        out: this,
        loop: totalNumOfLoops,
        endTime: loopStartedAt + totalNumOfLoops * this.sequenceDuration,
      })
    }
  }

  /**
   * @param startTime time elapsed in Tone.Transport
   */
  public assignSequence(numOfLoops = 1, startTime = 0) {
    if (this.isDisposed) return
    if (this.generator.sequence.isEmpty) return
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
