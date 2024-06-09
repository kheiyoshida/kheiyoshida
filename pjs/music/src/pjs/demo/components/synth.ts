import { makeLevelMap } from 'mgnr-tone'
import { DemoComponentMaker } from '../themes'
import { randomSequence, randomise, strictArpegio } from './patterns/generators'

export const defaultSynth: DemoComponentMaker = (source, level) => {
  const density = makeLevelMap([0.3, 0.4, 0.5, 0.6, 0.7])
  const scale = source.createScale({ range: { min: 40, max: 80 } })
  return {
    outId: 'synth',
    generators: [
      {
        generator: randomSequence(scale, density[level]),
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
