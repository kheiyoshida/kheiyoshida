import { MidiNote } from '../entities'

export class MidiInput {
  static async create(portName: string) {
    const midiAccess = await navigator.requestMIDIAccess()
    let midiInput: MIDIInput | null = null
    for (const input of midiAccess.inputs.values()) {
      if (input.name === portName) {
        midiInput = input
      }
    }
    if (!midiInput) throw new PortNotFoundError(portName, midiAccess)
    return new MidiInput(midiInput)
  }

  private constructor(private readonly midiInput: MIDIInput) {
    this.midiInput.onmidimessage = (event) => {
      const [status, pitch, velocity] = (event as MIDIMessageEvent).data

      const command = status & 0xf0
      const channel = (status & 0x0f) + 1 // Channels are 1-based

      if (command === 0x90 && velocity !== 0) {
        this.noteOnCallback({
          channel,
          pitch,
          velocity,
        })
      } else if (command === 0x80 && velocity == 0) {
        this.noteOffCallback({
          channel,
          pitch,
          velocity,
        })
      }
    }
  }

  private noteOnCallback: (note: MidiNote) => void = () => undefined
  private noteOffCallback: (note: MidiNote) => void = () => undefined

  public registerEvent(event: 'noteon' | 'noteoff', cb: (note: MidiNote) => void) {
    if (event === 'noteon') this.noteOnCallback = cb
    else this.noteOffCallback = cb
  }
}

class PortNotFoundError extends Error {
  constructor(portName: string, midiAccess: MIDIAccess) {
    const inputs = [...midiAccess.inputs.values()].map((input) => input.name)
    const mes = `Midi port ${portName} was not found. Available ports are: ${inputs.join(', ')}`
    super(mes)
  }
}
