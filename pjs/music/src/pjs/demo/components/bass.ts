import { SceneComponentMaker, createOutlet, getMixer, injectFadeInOut } from 'mgnr-tone'
import { SendChannel } from 'mgnr-tone/src/mixer/Channel'
import * as Tone from 'tone'
import { Character } from '../themes'
import * as instruments from './instruments'
import {
  addHarmonyToLongSequence,
  generateLongSequences,
  randomBassline,
  randomise,
} from './patterns/generators'

const mixer = getMixer()

export const defaultBass =
  (character: Character): SceneComponentMaker =>
  (startAt, source) => {
    const channel = mixer.createInstChannel({
      inst:
        character === 'dark'
          ? instruments.darkBass()
          : character === 'neutral'
            ? instruments.neutralBass()
            : instruments.brightBass(),
      initialVolume: -40,
      volumeRange: {
        max: -20,
        min: -40,
      },
    })
    const outlet = createOutlet(channel.inst, Tone.Transport.toSeconds('16n'))
    const scale = source.createScale({ range: { min: 20, max: 50 } })
    const generator = randomBassline(scale)
    const port = outlet
      .assignGenerator(generator)
      .loopSequence(4, startAt)
      .onElapsed((g) => g.mutate({ rate: 0.5, strategy: 'inPlace' }))
    const generator2 = randomise(scale)
    const port2 = outlet
      .assignGenerator(generator2)
      .loopSequence(4, startAt)
      .onEnded((g) => g.mutate({ rate: 0.2, strategy: 'randomize' }))
    return {
      ...injectFadeInOut(channel, [port, port2], scale),
      playLess() {},
      playMore() {},
    }
  }

export const longBass: SceneComponentMaker = (startAt, source, level, send) => {
  const pad = instruments.droneBass()
  const channel = mixer.createInstChannel({
    inst: pad,
    initialVolume: -20,
    volumeRange: {
      max: -6,
      min: -40,
    },
  })
  mixer.connect(channel, send as SendChannel, 1.2)
  const outlet = createOutlet(channel.inst, Tone.Transport.toSeconds('16n'))
  const scale = source.createScale({ range: { min: 20, max: 45 }, pref: 'major' })
  const generator = generateLongSequences(scale)
  const port = outlet
    .assignGenerator(generator)
    .loopSequence(4, startAt)
    .onEnded((g) => g.mutate({ rate: 0.5, strategy: 'inPlace' }))

  const generator2 = addHarmonyToLongSequence(scale)
  const port2 = outlet
    .assignGenerator(generator2)
    .loopSequence(4, startAt)
    .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }))
    .onEnded((g) => g.resetNotes())

  return {
    ...injectFadeInOut(channel, [port, port2], scale),
    playLess() {},
    playMore() {},
  }
}
