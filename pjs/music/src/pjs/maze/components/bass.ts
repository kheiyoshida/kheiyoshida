import { Range } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'
import { RandomLevel, convertRandomLevel } from './utils/randomness'

export const longDroneBass =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    const scaleRangeMap: Record<Saturation, Range> = {
      thin: {
        min: 24,
        max: 52
      },
      neutral: {
        min: 24,
        max: 60
      },
      thick: {
        min: 24,
        max: 68
      }
    }
    const scale = source.createScale({ range: scaleRangeMap[saturation] })
    const durationMap: Record<RandomLevel, number|Range> = {
      1: 4,
      2: 4,
      3: 4,
      4: 2,
      5: 2,
      6: 2,
      7: 1,
      8: 1,
      9: 1
    }
    return {
      outId: 'droneBass',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: 4,
              division: 2,
              density: saturation === 'thin' ? 0.5 : 1,
              polyphony: 'mono',
            },
            note: {
              duration: durationMap[randomLevel],
            },
          },
          loops: 4,
          onElapsed: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'inPlace' })
          },
          onEnded: (g) => g.mutate({ rate: randomLevel / 10, strategy: 'randomize' }),
        },
      ],
    }
  }
