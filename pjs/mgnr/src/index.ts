import * as mgnr from 'mgnr-core/src'
import { Note } from 'mgnr-core/src/generator/Note'
import midi from 'midi'

const BPM = 120
const msPerBeat = (1000 * 60) / BPM
const msPer8th = msPerBeat / 2
const msPer16th = msPerBeat / 4

const output = new midi.Output()
output.openPort(0)

class MidiChannel {
  constructor(private chNumber: number) {
  }

  public sendNote(pitch: number, vel: number) {
    output.sendMessage([144, pitch, vel])
  }
}

class MidiOutlet extends mgnr.Outlet<MidiChannel> {
  constructor(midiCh: MidiChannel) {
    super(midiCh)
  }

  public loopSequence(loop?: number | undefined, startTime?: number | undefined) {
    this.generator.sequence.iterateEachNote((note, position) => {
      this.reserveNote(position * msPer16th, note)
    })
    return this
  }

  private reserveNote(timeInMs: number, note: Note) {
    setTimeout(() => {
      this.inst.sendNote(note.pitch as number, note.vel as number)
    }, timeInMs)
    setTimeout(
      () => {
        this.inst.sendNote(note.pitch as number, 0)
      },
      timeInMs + (note.dur as number) * msPer16th
    )
  }
}

function main() {
  const scale = mgnr.createScale('C', 'omit25', { min: 30, max: 50 })
  const generator = mgnr.createGenerator({
    scale,
  })
  const midiCh = new MidiChannel(0)
  const outlet = new MidiOutlet(midiCh)
  generator.constructNotes()
  generator.feedOutlet(outlet)

  outlet.loopSequence()

}

function tryMidi() {
  const output = new midi.Output()

  ;[...new Array(output.getPortCount())].map((_, c) => {
    console.log(output.getPortName(c))
  })

  output.openPort(0)

  output.sendMessage([144, 63, 126])
  setTimeout(() => {
    output.sendMessage([144, 63, 0])
  }, 100)
  // output.sendMessage([176, 22, 1])

  // output.closePort()
}

main()
