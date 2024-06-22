import { DemoComponentMaker, Randomness, translate } from '../scenes'
import { convertRandomLevel } from './utils/randomness'

export const longDroneBass =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)

    const scale = source.createScale({ range: { min: 24, max: 52 } })
    return {
      outId: 'droneBass',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: 4,
              division: 1,
              density: saturation === 'thin' ? 0.5 : 1,
              polyphony: 'mono',
            },
            note: {
              duration: 4,
            },
          },
          loops: 4,
          onElapsed: (g) => {
            metaRandomness === 'dynamic' && g.mutate({ rate: 0.2, strategy: 'randomize' })
          },
          onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }),
        },
      ],
    }
  }
