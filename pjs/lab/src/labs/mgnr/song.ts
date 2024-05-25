import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'

export const polysynth = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: 'sine4',
  },
  envelope: {
    attack: 0.5,
    decay: 0.3,
    sustain: 0.3,
    release: 0.3,
  },
  volume: -10,
  detune: -20,
  filter: {
    type: 'lowpass',
    frequency: 100,
  },
})

export const polysynth2 = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: 'sine4',
  },
  envelope: {
    attack: 0.5,
    decay: 0.3,
    sustain: 0.3,
    release: 0.3,
  },
  volume: -20,
  detune: -200,
})

const mono = new Tone.MonoSynth({
  oscillator: {
    type: 'sine4',
  },
  envelope: {
    attack: 0,
    decay: 0.3,
    sustain: 0.3,
    release: 0,
  },
  volume: -20,
  detune: -200,
})

export const composite = new mgnr.CompositeInstrument(polysynth, polysynth2)

export const prepareSong = () => {
  const scale = mgnr.createScale('C', 'omit25', { min: 60, max: 100 })
  const mixer = mgnr.getMixer()

  const synCh = mixer.createInstChannel({
    inst: mono,
    volumeRange: { min: -20, max: -10 },
    initialVolume: -10,
    // effects: [new Tone.PingPongDelay('.8n', 0.3)],
  })
  // const out1 = mgnr.createOutlet(synCh)

  // const generator = mgnr.createGenerator({
  //   scale: scale,
  //   length: 4,
  //   division: 8,
  //   density: 1,
  //   noteDur: 1,
  //   fillPref: 'mono',
  //   fillStrategy: 'fixed',
  // })

  // // generator.constructNotes({
  // //   2: [
  // //     {
  // //       pitch: 60,
  // //       vel: 127,
  // //       dur: 1,
  // //     },
  // //   ],
  // // })
  // generator
  //   .feedOutlet(out1)
  //   .loopSequence(4)
  //   .onEnded((mes) => {
  //     // mes.out.generator.mutate({ rate: 0.5, strategy: 'randomize' })
  //     mes.repeatLoop()
  //   })

  const generator2 = mgnr.createGenerator({
    scale: scale,
    length: 8,
    division: 8,
    density: 1,
    noteDur: 1,
    fillPref: 'mono',
    fillStrategy: 'fixed',
  })
  const out2 = mgnr.createOutlet(synCh)
  generator2.constructNotes({
    1: [
      {
        pitch: 60,
        vel: 100,
        dur: 1,
      },
    ],
  })
  generator2
    .feedOutlet(out2)
    .loopSequence(2)
    .onEnded((mes) => mes.repeatLoop())
}
