import easymidi from 'easymidi'
import { MidiNote } from './types'

export class PortNotFoundError extends Error {
  constructor(portName: string, availablePorts: string[]) {
    super(
      `Output port ${portName} is not availavble. Avaialble ports are: ${availablePorts.join(`, `)}`
    )
  }
}

export class MidiPort {
  readonly portName: string
  readonly output: easymidi.Output
  readonly bpm: number
  readonly msPerMeasure: number

  constructor(portName: string, bpm: number) {
    const availablePorts = easymidi.getOutputs()
    if (!availablePorts.includes(portName)) {
      throw new PortNotFoundError(portName, availablePorts)
    }
    this.portName = portName
    this.output = new easymidi.Output(portName)
    this.bpm = bpm
    this.msPerMeasure = (1000 * 60) / (this.bpm / 4)
  }

  noteOnAtRelativeBeat(beat: number, note: MidiNote) {
    this.#noteOnAtRelativeTime(beat * this.msPerMeasure, note)
  }
  noteOffAtRelativeBeat(beat: number, note: MidiNote) {
    this.#noteOffAtRelativeTime(beat * this.msPerMeasure, note)
  }

  #noteOnAtRelativeTime(ms: number, note: MidiNote) {
    setTimeout(() => {
      this.output.send('noteon', note)
    }, ms)
  }
  #noteOffAtRelativeTime(ms: number, note: MidiNote) {
    setTimeout(() => {
      this.output.send('noteoff', note)
    }, ms)
  }
}
