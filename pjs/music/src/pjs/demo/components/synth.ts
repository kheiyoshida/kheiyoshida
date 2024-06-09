import {
  ComponentPlayLevel,
  SceneComponentMaker,
  clampPlayLevel,
  createOutlet,
  getMixer,
  injectFadeInOut,
  makeLevelMap,
} from 'mgnr-tone'
import * as Tone from 'tone'
import * as instruments from './instruments'
import { randomSequence, randomise, strictArpegio } from './patterns/generators'
import { Character } from '../themes'
import { SendChannel } from 'mgnr-tone/src/mixer/Channel'

const mixer = getMixer()

export const defaultSynth =
  (character: Character): SceneComponentMaker =>
  (startAt, source, level, send) => {
    const delayLevel = (l: ComponentPlayLevel) => (l >= 4 ? 0.4 : 0.3)
    const delay = new Tone.PingPongDelay('8n.', delayLevel(level))
    const synCh = mixer.createInstChannel({
      inst:
        character === 'bright'
          ? instruments.brightLead()
          : character === 'neutral'
            ? instruments.anxiousThinSynth()
            : instruments.darkLead(),
      initialVolume: -30,
      volumeRange: { max: -16, min: -50 },
      effects: [],
    })

    mixer.connect(synCh, send as SendChannel, 0.5)
    const outlet = createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

    const density = makeLevelMap([0.3, 0.4, 0.5, 0.6, 0.7])

    const scale = source.createScale({ range: { min: 40, max: 80 } })
    const generator = randomSequence(scale, density[level])
    const port = outlet
      .assignGenerator(generator)
      .loopSequence(4, startAt)
      .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
    const generator2 = randomise(scale)
    const port2 = outlet
      .assignGenerator(generator2)
      .loopSequence(4, startAt)
      .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))

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
      ...injectFadeInOut(synCh, [port, port2], scale),
    }
  }

export const freeformSynth =
  (character: Character): SceneComponentMaker =>
  (startAt, source, level, send) => {
    const delayLevel = makeLevelMap([0.1, 0.2, 0.3, 0.4, 0.5])
    const delay = new Tone.PingPongDelay('2n', delayLevel[level])
    const synCh = mixer.createInstChannel({
      inst:
        character === 'bright'
          ? instruments.brightLead()
          : character === 'neutral'
            ? instruments.anxiousThinSynth()
            : instruments.darkLead(),
      initialVolume: -30,
      volumeRange: { max: -16, min: -50 },
      effects: [delay],
    })

    mixer.connect(synCh, send as SendChannel, 0.5)

    const outlet = createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

    const density = makeLevelMap([0.3, 0.4, 0.5, 0.6, 0.7])

    const scale = source.createScale({ range: { min: 50, max: 100 }, pref: 'major' })
    const generator = strictArpegio(scale)
    const port = outlet
      .assignGenerator(generator)
      .loopSequence(4, startAt)
      .onEnded((g) => {
        g.mutate({ rate: 0.2, strategy: 'randomize' })
        g.changeLength(2)
      })
    const generator2 = randomise(scale)
    const port2 = outlet
      .assignGenerator(generator2)
      .loopSequence(4, startAt)
      .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))

    return {
      playLess() {
        level = clampPlayLevel(level - 1)
        delay.set({ wet: delayLevel[level] })
        generator2.updateConfig({
          sequence: {
            density: density[level],
          },
        })
      },
      playMore() {
        level = clampPlayLevel(level + 1)
        delay.set({ wet: delayLevel[level] })
        generator2.updateConfig({
          sequence: {
            density: density[level],
          },
        })
      },
      ...injectFadeInOut(synCh, [port, port2], scale),
    }
  }
