import { Range } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'
import { createScaleRange } from './utils/scale'

export const defaultPad =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)

    // const randomness: Randomness = 'dynamic'
    // const saturation: Saturation = 'neutral'

    const CenterOctaveMap: Record<Saturation, [number, number]> = {
      thin: [68, 1],
      neutral: [56, 1.4],
      thick: [60, 2.6]
    }
    const scale = source.createScale({range: createScaleRange(...CenterOctaveMap[saturation])})
    const SequenceLengthMap: Record<Randomness, number> = {
      static: 16,
      hybrid: 8,
      dynamic: 8
    }
    const NoteLengthMap: Record<Randomness, number|Range> = {
      static: 8,
      hybrid: 4,
      dynamic: {
        min: 2,
        max: 4
      }
    }
    const MultiLayerDensityMap: Record<Randomness, number> = {
      static: 0.5,
      hybrid: 1,
      dynamic: 1.5
    }
    return {
      outId: 'pad',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: SequenceLengthMap[randomness],
              division: 1,
              density: 1,
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteLengthMap[randomness],
            },
          },
          loops: 2,
          onElapsed: (g) => {
            g.mutate({ rate: 0.1, strategy: 'inPlace' })
          },
          onEnded: (g) => {
            g.mutate({ rate: 0.1, strategy: 'randomize' })
          },
        },
        {
          generator: {
            scale,
            sequence: {
              length: 12,
              division: 1,
              density: MultiLayerDensityMap[randomness],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteLengthMap[randomness],
            },
          },
          loops: 2,
          onElapsed: (g) => {
            g.mutate({ rate: 0.1, strategy: 'inPlace' })
          },
          onEnded: (g) => {
            g.mutate({ rate: 0.1, strategy: 'randomize' })
          },
        },
      ],
    }
  }
