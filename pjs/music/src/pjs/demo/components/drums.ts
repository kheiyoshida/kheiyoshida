import { createScale } from 'mgnr-tone'
import { DemoComponentMaker } from '../themes'
import { dnb, fill, kick2, snare } from './patterns/sequences'

const dmScale = createScale([30, 50, 90])
const snareHHScale = createScale([50, 90])

export const defaultDrums: DemoComponentMaker = (_, level) => {
  return {
    outId: 'drums',
    generators: [
      {
        generator: {
          scale: dmScale,
          note: {
            duration: 1,
          },
          sequence: {
            length: 16,
            division: 16,
            density: 2 / 16,
            polyphony: 'mono',
          },
        },
        notes: kick2,
        loops: 2,
        onElapsed: (g) => g.mutate({ rate: 0.1, strategy: 'move' }),
        onEnded: (g) => g.resetNotes(kick2),
      },
      {
        generator: {
          scale: snareHHScale,
          note: {
            duration: 1,
          },
          sequence: {
            length: 16,
            division: 16,
            density: 4 / 16,
            polyphony: 'mono',
          },
        },
        notes: snare,
        loops: 2,
        onElapsed: (g) => g.mutate({ rate: 0.1, strategy: 'inPlace' }),
        onEnded: (g) => g.resetNotes(snare),
      },
    ],
  }
}

export const dnbDrums: DemoComponentMaker = (_, level) => {
  const dmScale = createScale([30, 50, 90])

  return {
    outId: 'drums',
    generators: [
      {
        generator: {
          scale: dmScale,
          note: {
            duration: 1,
          },
          sequence: {
            length: 16,
            division: 16,
            density: 5 / 16,
            polyphony: 'mono',
          },
          notes: dnb,
        },
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.1, strategy: 'move' }),
        onEnded: (g) => g.resetNotes(dnb),
      },
      {
        generator: {
          scale: dmScale,
          note: {
            duration: 1,
          },
          sequence: {
            fillStrategy: 'fill',
            length: 16,
            division: 16,
            density: 6 / 16,
            polyphony: 'mono',
          },
          notes: fill,
        },
        loops: 2,
        onElapsed: (g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }),
        onEnded: (g) => g.resetNotes(fill),
      },
    ],
  }
}
