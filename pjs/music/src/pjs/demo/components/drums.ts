import { createScale, makeLevelMap } from 'mgnr-tone'
import { DemoComponentMaker } from '../themes'
import { kicks, randomFill } from './patterns/beat'
import { backHH, dnb, fill, kick4 } from './patterns/sequences'

const dmScale = createScale([30, 50, 90])
const snareHHScale = createScale([50, 90])

export const onlyKicks: DemoComponentMaker = (_, level) => {

  return {
    outId: 'drums',
    generators: [
      {
        generator: kicks(dmScale, 0.6),
        notes: kick4,
        loops: 2,
        onElapsed: () => undefined,
        onEnded: (g) => g.resetNotes(kick4),
      },
    ],
  }
}

export const defaultDrums: DemoComponentMaker = (_, level) => {
  const density = makeLevelMap([0.3, 0.3, 0.4, 0.5, 0.5])
  return {
    outId: 'drums',
    generators: [
      {
        generator: kicks(dmScale, 0.6),
        notes: kick4,
        loops: 2,
        onElapsed: (g) => g.mutate({ rate: 0.1, strategy: 'inPlace' }),
        onEnded: (g) => g.resetNotes(kick4),
      },
      {
        generator: randomFill(snareHHScale, density[level]),
        notes: backHH,
        loops: 2,
        onElapsed: () => undefined,
        onEnded: (g) => g.resetNotes(backHH),
      },
    ],
  }
}

export const dnbDrums: DemoComponentMaker = (_, level) => {
  const dmScale = createScale([30, 50, 90])
  const density = makeLevelMap([0.3, 0.4, 0.5, 0.6, 0.7])
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
            density: density[level],
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
            density: density[level],
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
