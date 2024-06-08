import {
  ComponentPlayLevel,
  ThemeComponentMaker,
  clampPlayLevel,
  createOutlet,
  getMixer,
  injectFadeInOut,
} from 'mgnr-tone'
import * as Tone from 'tone'
import * as instruments from './instruments'
import { randomSequence } from './patterns/generators'

const mixer = getMixer()

export const sampleSynth: ThemeComponentMaker = (startAt, source, level) => {
  const delayLevel = (l: ComponentPlayLevel) => (l >= 4 ? 0.4 : 0.3)
  const delay = new Tone.PingPongDelay('8n.', delayLevel(level))
  const synCh = mixer.createInstChannel({
    inst: instruments.brightLead(),
    initialVolume: -30,
    effects: [],
  })
  const outlet = createOutlet(synCh.inst)

  const generator = randomSequence(
    source.createScale({ range: { min: 50, max: 100 }, pref: 'major' })
  )
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
