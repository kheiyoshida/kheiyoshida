import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'
import { fireByRate, randomIntInclusiveBetween } from 'utils'
import { compsoiteSynth, drumMachine } from './instruments'
import { dnb } from './sequence'

const mixer = mgnr.getMixer()

export const prepareSong = () => {
  Tone.Transport.bpm.value = 172
  prepareDrums()
  prepareSynth()
}

const prepareDrums = () => {
  const scale = mgnr.createScale([30, 50, 90])
  const synCh = mixer.createInstChannel({
    inst: drumMachine,
    initialVolume: -6,
    effects: [new Tone.BitCrusher(16)],
  })

  const outlet = mgnr.createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

  const generator = mgnr.createGenerator({
    scale: scale,
    note: {
      duration: 1,
    },
    sequence: {
      fillStrategy: 'fill',
      length: 16,
      division: 16,
      density: 0.25,
      polyphony: 'mono',
    },
  })
  const generator2 = mgnr.createGenerator({
    scale: scale,
    sequence: {
      length: 12,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: 1,
    },
  })

  generator.constructNotes(dnb)
  generator2.constructNotes()

  outlet
    .assignGenerator(generator)
    .loopSequence(4)
    .onElapsed((g, n) => {
      if (n % 2 === 1) {
        g.sequence.iterateEachNote((note, i) => {
          if (fireByRate(0.5)) {
            g.sequence.deleteNoteFromPosition(i, note)
          }
        })
      }
    })
    .onEnded((g) => {
      g.resetNotes(dnb)
    })
  outlet
    .assignGenerator(generator2)
    .loopSequence(4)
    .onElapsed((g, n) => {
      if (n % 2 === 1) {
        g.sequence.iterateEachNote((note, i) => {
          if (fireByRate(0.1)) {
            g.sequence.deleteNoteFromPosition(i, note)
          }
        })
      } else {
        if (fireByRate(0.2)) {
          g.sequence.addNote(randomIntInclusiveBetween(0, g.sequence.length - 1), {
            pitch: 30,
            dur: 1,
            vel: 100,
          })
        }
      }
    })
    .onEnded((g) => g.mutate({ rate: 0.3, strategy: 'move' }))
}

const prepareSynth = () => {
  const scale = mgnr.createScale('C', 'omit25', { min: 50, max: 80 })
  const compositeCh = mixer.createInstChannel({
    inst: compsoiteSynth,
    initialVolume: -20,
    effects: [new Tone.PingPongDelay('.8n', 0.3)],
  })
  const outlet = mgnr.createOutlet(compositeCh.inst)
  const generator = mgnr.createGenerator({
    scale: scale,
    sequence: {
      length: 10,
      density: 0.7,
      division: 4,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 4,
        max: 8,
      },
      harmonizer: {
        degree: ['3', '5', '7'],
        force: false,
        lookDown: false,
      },
    },
  })
  generator.constructNotes()
  outlet
    .assignGenerator(generator)
    .loopSequence(4)
    .onElapsed((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'inPlace' })
    })
    .onEnded((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'randomize' })
    })
}
