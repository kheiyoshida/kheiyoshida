import * as mgnr from 'mgnr-tone'
import * as Tone from  'tone'
import * as instruments from '../../pjs/maze/components/instruments'

let done = false

export const main = () => {
  if (done) return
  done = true

  const mixer = mgnr.getMixer()
  const channel = mixer.createInstChannel({
    inst: instruments.thinSynth(),
  })

  navigator.requestMIDIAccess().then((midi) => {
    for (const input of midi.inputs.values()) {
      input.onmidimessage = (e) => {
        const [status, note, velocity] = e.data!;

        const isNoteOn = (status & 0xf0) === 0x90 && velocity > 0;
        if (!isNoteOn) return;

        const noteName = Tone.Frequency(note, "midi").toNote()
        console.log(note, noteName)
        channel.inst.triggerAttackRelease(noteName, '8n')
      };
    }
  });
}
