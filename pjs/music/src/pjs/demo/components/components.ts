import {
  ComponentPlayLevel,
  ThemeComponentMaker,
  clampPlayLevel,
  createGenerator,
  createOutlet,
  createScale,
  getMixer,
  injectFadeInOut,
  makeLevelMap,
  pingpongSequenceLength,
} from 'mgnr-tone'
import * as Tone from 'tone'
import {
  createDrumMachine,
  createNuancePad,
  createPadSynth,
  createSynth,
  wonderBass,
} from './instruments'
import { danceBeat, dnb, fill } from './sequence'

const mixer = getMixer()

export const prepareDrums: ThemeComponentMaker = (startAt, _, level) => {
  const dmScale = createScale([30, 50, 90])
  const synCh = mixer.createInstChannel({
    inst: createDrumMachine(),
    initialVolume: -30,
    effects: [new Tone.BitCrusher(16)],
  })

  const outlet = createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

  const density = makeLevelMap([0.3, 0.3, 0.4, 0.5, 0.5])

  const generator = createGenerator({
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
    notes: dnb,
  })

  const generator2 = createGenerator({
    scale: dmScale,
    note: {
      duration: 1,
    },
    sequence: {
      fillStrategy: 'fill',
      length: 64,
      division: 16,
      density: density[level],
      polyphony: 'mono',
    },
    middlewares: {
      foo: () => undefined,
    },
    notes: fill,
  })

  const port1 = outlet
    .assignGenerator(generator) //
    .loopSequence(2, startAt)
  const port2 = outlet
    .assignGenerator(generator2)
    .loopSequence(2, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'move' }))
    .onEnded((g) => g.resetNotes(fill))

  return {
    playLess() {
      level = clampPlayLevel(level - 1)
    },
    playMore() {
      level = clampPlayLevel(level + 1)
      generator2.updateConfig({
        sequence: {
          density: density[level],
        },
      })
    },
    ...injectFadeInOut(synCh, [port1, port2]),
  }
}

export const prepareStaticDrums: ThemeComponentMaker = (startAt, _, level) => {
  const dmScale = createScale([30, 50, 90])
  const synCh = mixer.createInstChannel({
    inst: createDrumMachine(),
    initialVolume: -30,
    effects: [new Tone.BitCrusher(16)],
  })

  const outlet = createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

  const density = makeLevelMap([0.5, 0.5, 0.5, 0.6, 0.7])
  const generator = createGenerator({
    scale: dmScale,
    note: {
      duration: 1,
    },
    sequence: {
      fillStrategy: 'fixed',
      length: 16,
      division: 16,
      density: density[level],
      polyphony: 'mono',
    },
    notes: danceBeat,
  })

  const port1 = outlet
    .assignGenerator(generator)
    .loopSequence(2, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.1, strategy: 'move' }))
    .onEnded((g) => g.resetNotes(danceBeat))

  return {
    playLess() {
      level = clampPlayLevel(level - 1)
      generator.updateConfig({
        sequence: {
          density: density[level],
        },
      })
    },
    playMore() {
      level = clampPlayLevel(level + 1)
      generator.updateConfig({
        sequence: {
          density: density[level],
        },
      })
    },
    ...injectFadeInOut(synCh, [port1]),
  }
}

export const prepareSynth: ThemeComponentMaker = (startAt, scale, level) => {
  const delayLevel = (l: ComponentPlayLevel) => (l >= 4 ? 0.4 : 0.3)
  const delay = new Tone.PingPongDelay('8n.', delayLevel(level))
  const synCh = mixer.createInstChannel({
    inst: createSynth(),
    initialVolume: -30,
    effects: [delay],
  })
  const outlet = createOutlet(synCh.inst)

  const generator = createGenerator({
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
  const port = outlet
    .assignGenerator(generator)
    .loopSequence(4, startAt)
    .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))

  return {
    playLess() {
      level = clampPlayLevel(level - 1)
      delay.set({ wet: delayLevel(level) })
    },
    playMore() {
      level = clampPlayLevel(level + 1)
      delay.set({ wet: delayLevel(level) })
    },
    ...injectFadeInOut(synCh, [port]),
  }
}

export const prepareStaticSynth: ThemeComponentMaker = (startAt, scale, level) => {
  const delayLevel = (l: ComponentPlayLevel) => (l >= 4 ? 0.4 : 0.3)
  const delay = new Tone.PingPongDelay('8n.', delayLevel(level))
  const density = makeLevelMap([0.5, 0.5, 0.6, 0.7, 0.8])
  const synCh = mixer.createInstChannel({
    inst: createPadSynth(),
    initialVolume: -30,
    effects: [delay],
  })
  const outlet = createOutlet(synCh.inst)

  const generator = createGenerator({
    scale,
    sequence: {
      length: 16,
      division: 8,
      density: density[level],
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

  const port = outlet
    .assignGenerator(generator)
    .loopSequence(2, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
    .onEnded((g) => g.resetNotes())

  return {
    playLess() {
      level = clampPlayLevel(level - 1)
      delay.set({ wet: delayLevel(level) })
      generator.updateConfig({
        sequence: {
          density: density[level],
        },
      })
    },
    playMore() {
      level = clampPlayLevel(level + 1)
      delay.set({ wet: delayLevel(level) })
      generator.updateConfig({
        sequence: {
          density: density[level],
        },
      })
    },
    ...injectFadeInOut(synCh, [port]),
  }
}

export const prepareNauncePadTrack: ThemeComponentMaker = (startAt, scale, level) => {
  const pad = createNuancePad()
  const channel = mixer.createInstChannel({
    inst: pad,
    initialVolume: -30,
    effects: [new Tone.PingPongDelay('8n.', 0.3)],
  })
  const outlet = createOutlet(channel.inst, Tone.Transport.toSeconds('16n'))
  const generator = createGenerator({
    scale,
    sequence: {
      length: 16,
      division: 16,
      density: 0.8,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 2,
      },
    },
  })
  const port = outlet.assignGenerator(generator).loopSequence(4, startAt)

  const generator2 = createGenerator({
    scale,
    sequence: {
      division: 16,
      length: 12,
      density: 0.3,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 2,
      },
      harmonizer: { degree: ['3', '5'] },
    },
    middlewares: {
      lengthChange: pingpongSequenceLength('extend'),
    },
  })
  const port2 = outlet
    .assignGenerator(generator2)
    .loopSequence(4, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }))
    .onEnded((g) => g.resetNotes())

  return {
    ...injectFadeInOut(channel, [port, port2]),
    playLess() {},
    playMore() {},
  }
}

export const prepareWonderBassTrack: ThemeComponentMaker = (startAt, scale, level) => {
  const pad = wonderBass()
  const channel = mixer.createInstChannel({
    inst: pad,
    initialVolume: -30,
  })
  const outlet = createOutlet(channel.inst, Tone.Transport.toSeconds('16n'))
  const generator = createGenerator({
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
  const port = outlet.assignGenerator(generator).loopSequence(4, startAt)

  const generator2 = createGenerator({
    scale,
    sequence: {
      division: 4,
      length: 12,
      density: 0.3,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 2,
      },
    },
    middlewares: {
      lengthChange: pingpongSequenceLength('extend'),
    },
  })
  const port2 = outlet
    .assignGenerator(generator2)
    .loopSequence(4, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }))
    .onEnded((g) => g.resetNotes())

  return {
    ...injectFadeInOut(channel, [port, port2]),
    playLess() {},
    playMore() {},
  }
}
