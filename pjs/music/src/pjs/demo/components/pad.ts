import { Range } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../themes'
import { addHarmonyToLongSequence, generateLongSequences } from './patterns/generators'

export const movingPad =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const scaleRange: Record<Saturation, Range> = {
      thin: {
        min: 80,
        max: 100,
      },
      neutral: {
        min: 70,
        max: 90,
      },
      thick: {
        min: 60,
        max: 80,
      },
    }
    const rateMap: Record<Randomness, number> = {
      static: 0,
      hybrid: 0.2,
      dynamic: 0.4,
    }
    const densityMap: Record<Saturation, number> = {
      thin: 0.25,
      neutral: 0.4,
      thick: 0.5,
    }
    const randomDensityAdjustMap: Record<Randomness, number> = {
      static: 0.25,
      hybrid: 0.15,
      dynamic: 0,
    }
    const noteDurationMap: Record<Randomness, number> = {
      static: 1,
      hybrid: 2,
      dynamic: 4,
    }
    const sequenceDurationMap: Record<Randomness, number> = {
      static: 8,
      hybrid: 12,
      dynamic: 20,
    }

    const rate = rateMap[randomness]
    const scale = source.createScale({ range: scaleRange[saturation] })
    return {
      outId: 'pad',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: sequenceDurationMap[metaRandomness],
              division: 16,
              density: densityMap[saturation],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: {
                min: 1,
                max: noteDurationMap[metaRandomness],
              },
            },
          },
          loops: 2,
          onElapsed: (g) => g.mutate({ rate, strategy: 'inPlace' }),
          onEnded: (g) => g.mutate({ rate, strategy: 'randomize' }),
        },
        {
          generator: {
            scale,
            sequence: {
              length: 10,
              division: 16,
              density: densityMap[saturation] - randomDensityAdjustMap[randomness],
              polyphony: 'mono',
            },
            note: {
              duration: {
                min: 1,
                max: 2,
              },
            },
          },
          loops: 2,
          onElapsed: (g) => g.mutate({ rate, strategy: 'randomize' }),
          onEnded: (g) => g.mutate({ rate, strategy: 'randomize' }),
        },
      ],
    }
  }

export const longPad =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const noteDurationMap: Record<Randomness, Range | number> = {
      static: 4,
      hybrid: {
        min: 2,
        max: 4,
      },
      dynamic: {
        min: 1,
        max: 2,
      },
    }
    const rateMap: Record<Randomness, number> = {
      static: 0,
      hybrid: 0.2,
      dynamic: 0.5,
    }
    const scaleRange: Record<Saturation, Range> = {
      thin: {
        min: 60,
        max: 72,
      },
      neutral: {
        min: 52,
        max: 72,
      },
      thick: {
        min: 42,
        max: 80,
      },
    }
    const densityMap: Record<Saturation, number> = {
      thin: 0.2,
      neutral: 0.4,
      thick: 0.7,
    }
    const randomiseRate: Record<Randomness, number> = {
      static: 0,
      hybrid: 0.2,
      dynamic: 0.5,
    }
    const scale = source.createScale({ range: scaleRange[saturation] })
    return {
      outId: 'pad',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: 4,
              division: 1,
              density: densityMap[saturation],
              polyphony: 'mono',
            },
            note: {
              duration: noteDurationMap[metaRandomness],
            },
          },
          loops: 4,
          onElapsed: (g) =>
            metaRandomness === 'dynamic' && g.mutate({ rate: 0.2, strategy: 'randomize' }),
          onEnded: (g) => g.mutate({ rate: rateMap[randomness], strategy: 'inPlace' }),
        },
        {
          generator: {
            scale,
            sequence: {
              length: 12,
              division: 2,
              density: randomiseRate[metaRandomness],
              polyphony: 'mono',
            },
            note: {
              duration: noteDurationMap[metaRandomness],
            },
          },
          loops: 2,
          onElapsed: (g) =>
            metaRandomness === 'dynamic' && g.mutate({ rate: 0.2, strategy: 'randomize' }),
          onEnded: (g) => g.mutate({ rate: rateMap[randomness], strategy: 'inPlace' }),
        },
      ],
    }
  }
