import * as mgnr from 'mgnr-tone'
import * as Tone from 'tone'
import { createDrumMachine, createPadSynth, createSynth } from './instruments'
import { danceBeat, dnb, fill } from './sequence'

const mixer = mgnr.getMixer()

export const prepareDrums: mgnr.ThemeComponentMaker = (startAt) => {
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

  const port1 = outlet
    .assignGenerator(generator) //
    .loopSequence(2, startAt)
  const port2 = outlet
    .assignGenerator(generator2)
    .loopSequence(2, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'move' }))
    .onEnded((g) => g.resetNotes(fill))

  return {
    channel: synCh,
    playLess() {},
    playMore() {},
    fadeIn: (duration) => {
      synCh.dynamicVolumeFade(synCh.volumeRangeDiff, duration)
    },
    fadeOut: (duration) => {
      synCh.dynamicVolumeFade(-synCh.volumeRangeDiff, duration)
      Tone.Transport.scheduleOnce(() => {
        port1.numOfLoops = 0
        port2.numOfLoops = 0
        mixer.deleteChannel(synCh)
      }, `+${duration}`)
    },
  }
}

export const prepareStaticDrums: mgnr.ThemeComponentMaker = (startAt) => {
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
      density: 0.25,
      polyphony: 'mono',
    },
  })

  generator.constructNotes(danceBeat)

  const port1 = outlet
    .assignGenerator(generator)
    .loopSequence(2, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.1, strategy: 'move' }))
    .onEnded((g) => g.resetNotes(danceBeat))

  return {
    channel: synCh,
    playLess() {},
    playMore() {},
    fadeIn: (duration) => {
      synCh.dynamicVolumeFade(synCh.volumeRangeDiff, duration)
    },
    fadeOut: (duration) => {
      synCh.dynamicVolumeFade(-synCh.volumeRangeDiff, duration)
      Tone.Transport.scheduleOnce(() => {
        port1.numOfLoops = 0
        mixer.deleteChannel(synCh)
      }, `+${duration}`)
    },
  }
}

export const prepareSynth: mgnr.ThemeComponentMaker = (startAt, scale) => {
  const synCh = mixer.createInstChannel({
    inst: createSynth(),
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
    .loopSequence(4, startAt)
    .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))

  return {
    channel: synCh,
    playLess() {},
    playMore() {},
    fadeIn: (duration) => {
      synCh.dynamicVolumeFade(synCh.volumeRangeDiff, duration)
    },
    fadeOut: (duration) => {
      synCh.dynamicVolumeFade(-synCh.volumeRangeDiff, duration)
      Tone.Transport.scheduleOnce(() => {
        mixer.deleteChannel(synCh)
        port.numOfLoops = 0
      }, `+${duration}`)
    },
  }
}

export const prepareStaticSynth: mgnr.ThemeComponentMaker = (startAt, scale) => {
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
      division: 8,
      density: 0.8,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 2,
      },
      harmonizer: {
        degree: ['4'],
      },
    },
  })
  generator.constructNotes()
  const port = outlet
    .assignGenerator(generator)
    .loopSequence(4, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))

  return {
    channel: synCh,
    playLess() {},
    playMore() {},
    fadeIn: (duration) => synCh.dynamicVolumeFade(synCh.volumeRangeDiff, duration),
    fadeOut: (duration) => {
      synCh.dynamicVolumeFade(-synCh.volumeRangeDiff, duration)
      Tone.Transport.scheduleOnce(() => {
        mixer.deleteChannel(synCh)
        port.numOfLoops = 0
      }, `+${duration}`)
    },
  }
}
