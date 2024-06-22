import { DemoComponentMaker, Randomness, translate } from '../scenes'
import { createScale } from 'mgnr-tone'
import { RandomLevel, convertRandomLevel } from './utils/randomness'
import { Range } from 'utils'

const noiseScale = createScale([30, 50, 70, 90])

export const defaultNoise =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (_, alignment) => {
    metaRandomness = 'dynamic'
    const randomness:Randomness = 'dynamic'
    // const { randomness } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    const DensityMap: Record<RandomLevel, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 1 / 32,
      5: 1 / 16,
      6: 3 / 32,
      7: 1 / 8,
      8: 1 / 4,
      9: 1 / 3,
    }
    const NoteDurationMap: Record<RandomLevel, number | Range> = {
      1: 0,
      2: 0,
      3: 0,
      4: 1,
      5: 1,
      6: 1,
      7: {
        min: 1,
        max: 2,
      },
      8: {
        min: 2,
        max: 4,
      },
      9: {
        min: 4,
        max: 8,
      },
    }
    const ChangeRateMap: Record<Randomness, number> = {
      static: 0,
      hybrid: 0.1,
      dynamic: 0.3,
    }
    return {
      outId: 'noise',
      generators: [
        {
          scale: noiseScale,
          generator: {
            sequence: {
              length: 32,
              division: 16,
              density: DensityMap[randomLevel],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteDurationMap[randomLevel],
            },
          },
          loops: 2,
          onElapsed: (g) => g.mutate({ rate: ChangeRateMap[randomness], strategy: 'randomize' }),
          onEnded: (g) => g.resetNotes(),
        },
        {
          scale: noiseScale,
          generator: {
            sequence: {
              length: 10,
              division: 16,
              density: DensityMap[randomLevel],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteDurationMap[randomLevel],
            },
          },
          loops: 4,
          onElapsed: (g) => g.mutate({ rate: ChangeRateMap[randomness], strategy: 'randomize' }),
          onEnded: (g) => g.resetNotes(),
        },
      ],
    }
  }
