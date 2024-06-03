import * as mgnr from 'mgnr-tone'
import { Scale } from 'mgnr-tone'
import * as Tone from 'tone'
import { createDrumMachine, createPadSynth } from './instruments'
import { dnb, fill } from './sequence'

const mixer = mgnr.getMixer()

export type Theme = {
  fadeOut: () => void
}

const fadeInTime = '8m'
const fadeOutTime = '24m'

export const prepareDrums = (): Theme => {
  const dmScale = mgnr.createScale([30, 50, 90])
  const synCh = mixer.createInstChannel({
    inst: createDrumMachine(),
    initialVolume: -30,
    effects: [new Tone.BitCrusher(16)],
  })

  const outlet = mgnr.createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

  const generator = mgnr.createGenerator({
    scale: dmScale,
    note: {
      duration: 1,
    },
    sequence: {
      fillStrategy: 'fixed',
      length: 16,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
    },
  })

  const generator2 = mgnr.createGenerator({
    scale: dmScale,
    note: {
      duration: 1,
    },
    sequence: {
      fillStrategy: 'fill',
      length: 64,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
    },
  })

  generator.constructNotes(dnb)
  generator2.constructNotes(fill)

  const port1 = outlet.assignGenerator(generator).loopSequence(2, Tone.Transport.toSeconds('@4m'))
  const port2 = outlet
    .assignGenerator(generator2)
    .loopSequence(2, Tone.Transport.toSeconds('@4m'))
    .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'move' }))
    .onEnded((g) => g.resetNotes(fill))

  // fade in
  Tone.Transport.scheduleOnce(() => {
    synCh.dynamicVolumeFade(synCh.volumeRangeDiff, fadeInTime)
  }, '@4m')

  const fadeOut = () => {
    Tone.Transport.scheduleOnce(() => {
      synCh.dynamicVolumeFade(-synCh.volumeRangeDiff, fadeOutTime)
      Tone.Transport.scheduleOnce(() => {
        port1.numOfLoops = 0
        port2.numOfLoops = 0
        mixer.deleteChannel(synCh)
      }, `+${fadeOutTime}`)
    }, '@4m')
  }

  return {
    fadeOut,
  }
}

export const prepareSynth = (): Theme => {
  const scale = new Scale({ range: { min: 30, max: 80 }, pref: 'omit27' })
  const synCh = mixer.createInstChannel({
    inst: createPadSynth(),
    initialVolume: -30,
    effects: [new Tone.PingPongDelay('8n.', 0.3)],
  })
  const outlet = mgnr.createOutlet(synCh.inst)

  const generator = mgnr.createGenerator({
    scale,
    sequence: {
      length: 16,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 4,
      },
    },
  })
  generator.constructNotes({
    0: [
      {
        pitch: 48,
        vel: 100,
        dur: 2,
      },
    ],
    4: [
      {
        pitch: 52,
        vel: 100,
        dur: 2,
      },
    ],
  })
  const port = outlet
    .assignGenerator(generator)
    .loopSequence(4, Tone.Transport.toSeconds('@4m'))
    .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))

  Tone.Transport.scheduleOnce(() => {
    synCh.dynamicVolumeFade(synCh.volumeRangeDiff, fadeInTime)
  }, '@4m')

  return {
    fadeOut: () => {
      Tone.Transport.scheduleOnce(() => {
        synCh.dynamicVolumeFade(-synCh.volumeRangeDiff, fadeOutTime)
        Tone.Transport.scheduleOnce(() => {
          mixer.deleteChannel(synCh)
          port.numOfLoops = 0
        }, `+${fadeOutTime}`)
      }, '@4m')
    },
  }
}
