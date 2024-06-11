import { DemoComponentMaker } from '../themes'
import { randomSequence, randomise } from './patterns/generators'

export const defaultSynth: DemoComponentMaker = (source, level) => {
  const scale = source.createScale({ range: { min: 72, max: 100 } })
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
