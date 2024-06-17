import { DemoComponentMaker } from '../scenes'
import { createScale } from 'mgnr-tone'

export const defaultNoise: DemoComponentMaker = (source, alignment) => ({
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
})
