import { Range } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../themes'
import { randomBassline, randomise } from './patterns/generators'

export const defaultBass =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const maxPitchMap: Record<Saturation, number> = {
      thin: 42,
      neutral: 48,
      thick: 52,
    }
    const scale = source.createScale({ range: { min: 20, max: maxPitchMap[saturation] } })
    const densityMap: Record<Saturation, number> = {
      thin: 0.3,
      neutral: 0.4,
      thick: 0.5,
    }
    const rateMap: Record<Randomness, number> = {
      static: 0,
      hybrid: 0.2,
      dynamic: 0.5,
    }
    const randomSequenceLengthMap: Record<Randomness, number> = {
      static: 8,
      hybrid: 10,
      dynamic: 13
    }
    return {
      outId: 'bass',
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
                max: 8,
              },
            },
          },
          loops: 4,
          onElapsed: (g) => g.mutate({ rate: rateMap[metaRandomness], strategy: 'inPlace' }),
          onEnded: () => undefined,
        },
        {
          generator: {
            scale,
            sequence: {
              length: randomSequenceLengthMap[metaRandomness],
              division: 16,
              density: 0.5,
              polyphony: 'mono',
            },
            note: {
              duration: {
                min: 1,
                max: 2,
              },
            },
          },
          loops: 4,
          onElapsed: (g) => g.mutate({ rate: rateMap[randomness], strategy: 'randomize' }),
          onEnded: () => undefined,
        },
      ],
    }
  }

export const longDroneBass =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)

    const maxPitchMap: Record<Saturation, number> = {
      thin: 36,
      neutral: 48,
      thick: 52,
    }
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
    const scale = source.createScale({ range: { min: 24, max: maxPitchMap[saturation] } })
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
              duration: noteDurationMap[metaRandomness],
            },
          },
          loops: 4,
          onElapsed: (g) =>
            metaRandomness === 'dynamic' && g.mutate({ rate: 0.2, strategy: 'randomize' }),
          onEnded: (g) => g.mutate({ rate: rateMap[randomness], strategy: 'inPlace' }),
        },
      ],
    }
  }
