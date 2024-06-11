import { makeLevelMap } from 'mgnr-tone'
import { DemoComponentMaker } from '../themes'
import { randomSequence, randomise, strictArpegio } from './patterns/generators'

export const defaultSynth: DemoComponentMaker = (source, level) => {
  const scale = source.createScale({ range: { min: 60, max: 100 } })
  return {
    outId: 'synth',
    generators: [
      {
        generator: randomSequence(scale, 0.3),
        loops: 4,
        onElapsed: () => {
          return
        },
        onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
      },
      {
        generator: randomise(scale),
        loops: 4,
        onElapsed: () => {
          return
        },
        onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
      },
    ],
  }
}

export const freeformSynth: DemoComponentMaker = (source) => {
  const scale = source.createScale({ range: { min: 50, max: 100 }, pref: 'major' })
  return {
    outId: 'synth',
    generators: [
      {
        generator: strictArpegio(scale),
        // middlewares: { changeLength: pingpongSequenceLength('extend') },
        loops: 4,
        onElapsed: () => {
          return
        },
        onEnded: (g) => {
          g.mutate({ rate: 0.2, strategy: 'randomize' })
          // g.changeLength(2)
        },
      },
      {
        generator: randomise(scale),
        loops: 4,
        onElapsed: () => {
          return
        },
        onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
      },
    ],
  }
}
