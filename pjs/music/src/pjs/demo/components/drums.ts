import {
  ThemeComponentMaker,
  clampPlayLevel,
  createGenerator,
  createOutlet,
  createScale,
  getMixer,
  injectFadeInOut,
  makeLevelMap,
} from 'mgnr-tone'
import * as Tone from 'tone'
import { createDrumMachine } from './instruments'
import { danceBeat, dnb, fill } from './patterns/sequences'

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
