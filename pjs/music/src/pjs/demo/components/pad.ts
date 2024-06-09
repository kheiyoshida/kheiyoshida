import { DemoComponentMaker } from '../themes'
import {
  addHarmonyToLongSequence,
  generateLongSequences,
  movingSequence,
  randomise,
} from './patterns/generators'

export const longPad: DemoComponentMaker = (source, level) => {
  const scale = source.createScale({ range: { min: 42, max: 80 } })
  return {
    outId: 'pad',
    generators: [
      {
        generator: generateLongSequences(scale),
        loops: 4,
        onElapsed: () => {
          return
        },
        onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
      },
      {
        generator: addHarmonyToLongSequence(scale),
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
        onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
      },
    ],
  }
}

export const movingPad: DemoComponentMaker = (source, level) => {
  const scale = source.createScale({ range: { min: 50, max: 90 } })
  return {
    outId: 'pad',
    generators: [
      {
        generator: movingSequence(scale),
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }),
        onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
      },
      {
        generator: randomise(scale),
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
        onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
      },
    ],
  }
}
