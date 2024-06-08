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
import { SendChannel } from 'mgnr-tone/src/mixer/Channel'
import * as Tone from 'tone'
import { Character } from '../themes'
import { beatDrums, tightDrums } from './instruments'
import { kicks, randomFill } from './patterns/beat'
import { backHH, dnb, fill, kick4 } from './patterns/sequences'

const mixer = getMixer()

const dmScale = createScale([30, 50, 90])
const snareHHScale = createScale([50, 90])

export const defaultDrums =
  (character: Character): ThemeComponentMaker =>
  (startAt, _, level, send) => {
    const synCh = mixer.createInstChannel({
      inst: tightDrums(),
      initialVolume: -30,
      volumeRange: {
        max: -12,
        min: -40,
      },
      effects: [new Tone.BitCrusher(16)],
    })

    mixer.connect(synCh, send as SendChannel, 0.5)

    const outlet = createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

    const density = makeLevelMap([0.3, 0.3, 0.4, 0.5, 0.5])

    const generator = kicks(dmScale, 0.6)
    const generator2 = randomFill(snareHHScale, density[level])

    const port1 = outlet
      .assignGenerator(generator)
      .loopSequence(4, startAt)
      .onElapsed((g) => g.mutate({ rate: 0.1, strategy: 'inPlace' }))
      .onEnded((g) => g.resetNotes(kick4))
    const port2 = outlet
      .assignGenerator(generator2)
      .loopSequence(4, startAt)
      .onEnded((g) => g.resetNotes(backHH))
    return {
      playLess() {
        level = clampPlayLevel(level - 1)
        generator2.updateConfig({
          sequence: {
            density: density[level],
          },
        })
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

export const dnbDrums =
  (character: Character): ThemeComponentMaker =>
  (startAt, _, level, send) => {
    const dmScale = createScale([30, 50, 90])
    const synCh = mixer.createInstChannel({
      inst: character === 'neutral' ? beatDrums() : tightDrums(),
      initialVolume: -30,
      effects: [new Tone.BitCrusher(16)],
    })

    mixer.connect(synCh, send as SendChannel, 1)

    const outlet = createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

    const density = makeLevelMap([0.3, 0.4, 0.5, 0.6, 0.7])

    const generator = createGenerator({
      scale: dmScale,
      note: {
        duration: 1,
      },
      sequence: {
        length: 16,
        division: 16,
        density: density[level],
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
        length: 16,
        division: 16,
        density: density[level],
        polyphony: 'mono',
      },
      notes: fill,
    })

    const port1 = outlet
      .assignGenerator(generator) //
      .loopSequence(4, startAt)
      .onElapsed(g => g.mutate({ rate: 0.1, strategy: 'move' }))
      .onEnded(g => g.resetNotes(dnb))
    const port2 = outlet
      .assignGenerator(generator2)
      .loopSequence(2, startAt)
      .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }))
      .onEnded((g) => g.resetNotes(fill))

    return {
      playLess() {
        level = clampPlayLevel(level - 1)
        generator.updateConfig({
          sequence: {
            density: density[level],
          },
        })
        generator2.updateConfig({
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
        generator2.updateConfig({
          sequence: {
            density: density[level],
          },
        })
      },
      ...injectFadeInOut(synCh, [port1, port2]),
    }
  }
