import {
  ComponentPlayLevel,
  ThemeComponentMaker,
  clampPlayLevel,
  createGenerator,
  createOutlet,
  getMixer,
  injectFadeInOut,
  makeLevelMap,
  pingpongSequenceLength,
} from 'mgnr-tone'
import * as Tone from 'tone'
import * as instruments from './instruments'
import { generateLongSequences } from './patterns/generators'

const mixer = getMixer()

export const samplePad: ThemeComponentMaker = (startAt, source, level) => {
  const synCh = mixer.createInstChannel({
    inst: instruments.nuancePad(),
    initialVolume: -30,
    effects: [
      new Tone.Filter(200, 'highpass'),
      new Tone.PingPongDelay('8n.', 0.3),
    ]
  })
  const outlet = createOutlet(synCh.inst)
  const generator = generateLongSequences(source.createScale({ range: { min: 42, max: 80 } }))
  const port = outlet
    .assignGenerator(generator)
    .loopSequence(4, startAt)
    .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
  return {
    playLess() {},
    playMore() {},
    ...injectFadeInOut(synCh, [port]),
  }
}

export const darkPadSynth: ThemeComponentMaker = (startAt, source, level) => {
  const delayLevel = (l: ComponentPlayLevel) => (l >= 4 ? 0.4 : 0.3)
  const delay = new Tone.PingPongDelay('8n.', delayLevel(level))
  const synCh = mixer.createInstChannel({
    inst: instruments.anxiousThinSynth(),
    initialVolume: -30,
    effects: [delay],
  })
  const outlet = createOutlet(synCh.inst)

  const generator = createGenerator({
    scale: source.createScale(),
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

export const harmonisedPad: ThemeComponentMaker = (startAt, source, level) => {
  const delayLevel = (l: ComponentPlayLevel) => (l >= 4 ? 0.4 : 0.3)
  const delay = new Tone.PingPongDelay('8n.', delayLevel(level))
  const density = makeLevelMap([0.5, 0.5, 0.6, 0.7, 0.8])
  const synCh = mixer.createInstChannel({
    inst: instruments.darkPad(),
    initialVolume: -30,
    effects: [delay],
  })
  const outlet = createOutlet(synCh.inst)

  const generator = createGenerator({
    scale: source.createScale(),
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

export const nuancePad: ThemeComponentMaker = (startAt, source) => {
  const pad = instruments.nuancePad()
  const channel = mixer.createInstChannel({
    inst: pad,
    initialVolume: -30,
    effects: [new Tone.PingPongDelay('8n.', 0.3)],
  })
  const outlet = createOutlet(channel.inst, Tone.Transport.toSeconds('16n'))
  const scale = source.createScale({ range: { min: 60, max: 100 }, pref: 'omit47' })
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
