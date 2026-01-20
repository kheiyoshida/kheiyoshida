import * as mgnr from 'mgnr-tone'
import { droneBass } from '../../pjs/demo/components/instruments'
import * as Tone from  'tone'

export const main = () => {
  const mixer = mgnr.getMixer()
  const channel = mixer.createInstChannel({
    inst: droneBass(),
  })

  navigator.requestMIDIAccess().then((midi) => {
    for (const input of midi.inputs.values()) {
      input.onmidimessage = (e) => {
        const [status, note, velocity] = e.data!;

        const isNoteOn = (status & 0xf0) === 0x90 && velocity > 0;
        if (!isNoteOn) return;

        const noteName = Tone.Frequency(note, "midi").toNote()
        console.log(noteName)
        channel.inst.triggerAttackRelease(noteName, '8n')
      };
    }
  });
}
