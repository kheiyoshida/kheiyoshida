import { DemoComponentMaker, Randomness, translate } from '../scenes'

export const defaultSynth =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)

    const scale = source.createScale({
      range: {
        min: 100,
        max: 112,
      },
    })
    return {
      outId: 'synth',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: 3,
              division: 8,
              density: 1,
              polyphony: 'mono',
            },
            note: {
              duration: 1
            },
          },
          loops: 8,
          onElapsed: () => undefined,
          onEnded: (g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }),
        },
      ],
    }
  }
