import { DemoComponentMaker, Randomness, translate } from '../scenes'
import { createScale } from 'mgnr-tone'
import { convertRandomLevel } from './utils/randomness'

export const defaultNoise =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    return {
      outId: 'noise',
      generators: [
        {
          scale: createScale([30, 60]),
          generator: {
            sequence: {
              length: 16,
              division: 16,
              density: 0.1,
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: 1,
            },
          },
          loops: 4,
          onElapsed: () => undefined,
          onEnded: (g) => g.resetNotes(),
        },
      ],
    }
  }
