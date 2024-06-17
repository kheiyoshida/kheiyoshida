import { DemoComponentMaker, Randomness, translate } from '../scenes'

export const defaultPad =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)

    const scale = source.createScale({ range: { min: 52, max: 72 } })
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
