import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'
import { compsoiteSynth, drumMachine } from './instruments'
import { SequenceNoteMap } from '../../../../../pkgs/mgnr-core/src/generator/Sequence'
import { fireByRate, randomIntInclusiveBetween } from 'utils'

const mixer = mgnr.getMixer()

export const prepareSong = () => {
  prepareDrums()
  prepareSynth()
}

const prepareDrums = () => {
  const scale = mgnr.createScale('C', 'major', { min: 30, max: 80 })
  const synCh = mixer.createInstChannel({
    inst: drumMachine,
    initialVolume: -6,
  })

  const outlet = mgnr.createOutlet(synCh.inst, Tone.Transport.toSeconds('2n'))

  const generator = mgnr.createGenerator({
    scale: scale,
    note: {
      noteDur: 1,
      fillStrategy: 'fill',
    },
    sequence: {
      length: 16,
      division: 16,
      density: 0.25,
      fillPref: 'allowPoly',
    },
  })
  const generator2 = mgnr.createGenerator({
    scale: scale,
    sequence: {
      length: 16,
      division: 16,
      density: 0.5,
      fillPref: 'mono',
    },
    note: {
      noteDur: 1,
      fillStrategy: 'fixed',
    },
  })

  const fixedNotes: SequenceNoteMap = {
    0: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
    ],
    4: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
      {
        pitch: 50,
        dur: 1,
        vel: 100,
      },
    ],
    8: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
    ],
    12: [
      {
        pitch: 30,
        dur: 1,
        vel: 100,
      },
      {
        pitch: 50,
        dur: 1,
        vel: 100,
      },
    ],
  }
  generator.constructNotes(fixedNotes)

  generator2.constructNotes({
    2: [
      {
        pitch: 90,
        dur: 1,
        vel: 100,
      },
    ],
    6: [
      {
        pitch: 90,
        dur: 1,
        vel: 100,
      },
    ],
    10: [
      {
        pitch: 90,
        dur: 1,
        vel: 100,
      },
    ],
    14: [
      {
        pitch: 90,
        dur: 1,
        vel: 100,
      },
    ],
  })

  outlet
    .assignGenerator(generator)
    .loopSequence(8)
    .onElapsed((g, n) => {
      if (n % 2 === 1) {
        g.sequence.iterateEachNote((note, i) => {
          if (fireByRate(0.2)) {
            g.sequence.deleteNoteFromPosition(i, note)
          }
        })
      } else {
        if (fireByRate(0.2)) {
          // g.constructNotes()
          g.sequence.addNote(randomIntInclusiveBetween(0, g.sequence.length - 1), {
            pitch: 30,
            dur: 1,
            vel: 100,
          })
        }
      }
    })
    .onEnded((g) => {
      g.resetNotes(fixedNotes)
    })
  outlet.assignGenerator(generator2).loopSequence(2)
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
      fillPref: 'mono',
    },
    note: {
      noteDur: {
        min: 4,
        max: 8,
      },
      harmonizer: {
        degree: ['3', '5', '7'],
        force: false,
        lookDown: false,
      },
      fillStrategy: 'fill',
    },
    middlewares: {
      custom: (ctx) => {
        console.log('this is custome middleware: ', ctx.scale.key)
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
