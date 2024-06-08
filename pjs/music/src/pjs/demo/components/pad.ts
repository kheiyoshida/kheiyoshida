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
import {
  addHarmonyToLongSequence,
  generateLongSequences,
  movingSequence,
  randomise,
} from './patterns/generators'
import { Character } from '../themes'
import { SendChannel } from 'mgnr-tone/src/mixer/Channel'

const mixer = getMixer()

export const longPad =
  (character: Character): ThemeComponentMaker =>
  (startAt, source, level, send) => {
    const synCh = mixer.createInstChannel({
      inst: character === 'bright' ? instruments.nuancePad() : instruments.darkPad(),
      initialVolume: -30,
      volumeRange: {
        max: -10,
        min: -40,
      },
      effects: [new Tone.Filter(300, 'highpass'), new Tone.PingPongDelay('8n.', 0.5)],
    })
    mixer.connect(synCh, send as SendChannel, 0.5)
    const outlet = createOutlet(synCh.inst)
    const scale = source.createScale({ range: { min: 42, max: 80 } })
    const generator = generateLongSequences(scale)
    const generator2 = addHarmonyToLongSequence(scale)
    const port = outlet
      .assignGenerator(generator)
      .loopSequence(4, startAt)
      .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }))
      .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
    const port2 = outlet
      .assignGenerator(generator2)
      .loopSequence(4, startAt)
      .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
      .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
    return {
      playLess() {},
      playMore() {},
      ...injectFadeInOut(synCh, [port, port2], scale),
    }
  }

export const movingPad =
  (character: Character): ThemeComponentMaker =>
  (startAt, source, level, send) => {
    const synCh = mixer.createInstChannel({
      inst: character === 'bright' ? instruments.nuancePad() : instruments.darkPad(),
      initialVolume: -30,
      volumeRange: {
        max: -10,
        min: -40,
      },
      effects: [new Tone.PingPongDelay('8n.', 0.3), new Tone.Filter(500, 'highpass')],
    })
    mixer.connect(synCh, send as SendChannel, 0.5)
    const outlet = createOutlet(synCh.inst)
    const scale = source.createScale({ range: { min: 50, max: 90 } })
    const generator = movingSequence(scale)
    const generator2 = randomise(scale)
    const port = outlet
      .assignGenerator(generator)
      .loopSequence(4, startAt)
      .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }))
      .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
    const port2 = outlet
      .assignGenerator(generator2)
      .loopSequence(4, startAt)
      .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
      .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
    return {
      playLess() {},
      playMore() {},
      ...injectFadeInOut(synCh, [port, port2], scale),
    }
  }

export const darkMovingPad: ThemeComponentMaker = (startAt, source, level) => {
  const delayLevel = (l: ComponentPlayLevel) => (l >= 4 ? 0.4 : 0.3)
  const delay = new Tone.PingPongDelay('8n.', delayLevel(level))
  const synCh = mixer.createInstChannel({
    inst: instruments.anxiousThinSynth(),
    initialVolume: -30,
    effects: [delay],
  })
  const outlet = createOutlet(synCh.inst)

  const scale = source.createScale()
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
    ...injectFadeInOut(synCh, [port], scale),
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

  const scale = source.createScale()
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
    ...injectFadeInOut(synCh, [port], scale),
  }
}
