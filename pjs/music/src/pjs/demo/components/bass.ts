import { DemoComponentMaker } from '../themes'
import {
  addHarmonyToLongSequence,
  generateLongSequences,
  randomBassline,
  randomise,
} from './patterns/generators'

export const defaultBass: DemoComponentMaker = (source, level) => {
  const scale = source.createScale({ range: { min: 20, max: 50 } })
  return {
    outId: 'bass',
    generators: [
      {
        generator: randomBassline(scale),
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.5, strategy: 'inPlace' }),
        onEnded: () => undefined,
      },
      {
        generator: randomise(scale),
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
        onEnded: () => undefined,
      },
    ],
  }
}

export const longDroneBass: DemoComponentMaker = (source, level) => {
  const scale = source.createScale({ range: { min: 20, max: 45 }, pref: 'major' })
  return {
    outId: 'droneBass',
    generators: [
      {
        generator: generateLongSequences(scale),
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.5, strategy: 'inPlace' }),
        onEnded: () => undefined,
      },
      {
        generator: addHarmonyToLongSequence(scale),
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }),
        onEnded: () => undefined,
      },
    ],
  }
}
