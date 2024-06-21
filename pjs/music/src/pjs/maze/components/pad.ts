
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'
import { createScaleRange } from './utils/scale'

export const defaultPad =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)

    const CenterOctaveMap: Record<Saturation, [number, number]> = {
      thin: [72, 1],
      neutral: [60, 1.4],
      thick: [64, 2.6]
    }
    const scale = source.createScale({range: createScaleRange(...CenterOctaveMap[saturation])})
    return {
      outId: 'pad',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: 8,
              division: 1,
              density: 1,
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: 4,
            },
          },
          loops: 4,
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
              density: 1,
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: 6,
            },
          },
          loops: 4,
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
