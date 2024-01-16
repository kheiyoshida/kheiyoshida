import * as mgnr from 'mgnr-core/src'
import { Note } from 'mgnr-core/src/generator/Note'
import midi, { Note as MidiNote } from 'easymidi'

const BPM = 120
const msPerBeat = (1000 * 60) / BPM
const msPer8th = msPerBeat / 2
const msPer16th = msPerBeat / 4

const OutputName = 'Logic Pro Virtual In'

const output = new midi.Output(OutputName)

class MidiChannel {
  constructor(private chNumber: number) {}

  public sendNote(pitch: number, vel: number) {
    output.send('noteon', {
      note: pitch,
      velocity: vel,
      channel: this.chNumber,
    } as MidiNote)
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
  const scale = mgnr.createScale('C', 'omit25', { min: 40, max: 80 })
  const generator = mgnr.createGenerator({
    scale,
  })
  const midiCh = new MidiChannel(0)
  const outlet = new MidiOutlet(midiCh)
  generator.constructNotes()
  generator.feedOutlet(outlet)

  outlet.loopSequence()
}

main()
