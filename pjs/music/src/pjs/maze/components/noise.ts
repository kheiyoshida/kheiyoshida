import { DemoComponentMaker, Randomness, translate } from '../scenes'
import { createScale } from 'mgnr-tone'
import { RandomLevel, convertRandomLevel } from './utils/randomness'
import { Range } from 'utils'

export const defaultNoise =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (_, alignment) => {
    const { randomness } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    const noises = [30, 50, 70, 90]
    const ScaleMap: Record<Randomness, number[]> = {
      static: noises.slice(0, 2),
      hybrid: noises.slice(0, 2),
      dynamic: noises.slice(1, 4),
    }
    const noiseScale = createScale(ScaleMap[randomness])
    const DensityMap: Record<RandomLevel, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 1 / 64,
      5: 1 / 32,
      6: 1 / 16,
      7: 1 / 8,
      8: 1 / 6,
      9: 1 / 4,
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
              length: 64,
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
              length: 24,
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
