import { Range } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'

export const defaultSynth =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const densityMap: Record<Saturation, number> = {
      thin: 0.3,
      neutral: 0.5,
      thick: 0.8,
    }
    const durationMap: Record<Randomness, number> = {
      static: 1,
      hybrid: 2,
      dynamic: 4,
    }
    const sequenceLengthMap: Record<Randomness, number> = {
      static: 8,
      hybrid: 16,
      dynamic: 11,
    }
    const pitchRangeMap: Record<Saturation, Range> = {
      thin: {
        min: 80,
        max: 96,
      },
      neutral: {
        min: 72,
        max: 96,
      },
      thick: {
        min: 60,
        max: 100,
      },
    }
    const scale = source.createScale({ range: pitchRangeMap[saturation] })
    return {
      outId: 'synth',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: 16,
              division: 16,
              density: densityMap[saturation],
              polyphony: 'mono',
            },
            note: {
              duration: {
                min: 1,
                max: durationMap[randomness],
              },
            },
          },
          loops: 4,
          onElapsed: () => undefined,
          onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
        },
        {
          generator: {
            scale,
            sequence: {
              length: sequenceLengthMap[metaRandomness] - 2,
              division: 16,
              density: metaRandomness !== 'static' ? 0.3 : 0,
              polyphony: 'mono',
            },
            note: {
              duration: {
                min: 1,
                max: durationMap[metaRandomness],
              },
            },
          },
          loops: 4,
          onElapsed: () => undefined,
          onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'randomize' }),
        },
      ],
    }
  }
