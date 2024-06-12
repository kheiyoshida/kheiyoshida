import { createScale } from 'mgnr-tone'
import { fireByRate, randomIntInclusiveBetween } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'
import { dnb, fill, kick2, snare } from './patterns/sequences'

const dmScale = createScale([30, 50, 90])
const snareHHScale = createScale([50, 90])

export const defaultDrums =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (_, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const numOfNotesMap: Record<Saturation, number> = {
      thin: 1,
      neutral: 2,
      thick: 4,
    }
    const rateMap: Record<Randomness, number> = {
      static: 0,
      hybrid: 0.2,
      dynamic: 0.5,
    }
    const fillSequenceLengthMap: Record<Randomness, number> = {
      static: 8,
      hybrid: 16,
      dynamic: 20,
    }
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
              density: numOfNotesMap[saturation] / 16,
              polyphony: 'mono',
            },
          },
          notes: kick2,
          loops: 2,
          onElapsed: (g) => g.mutate({ rate: rateMap[randomness], strategy: 'move' }),
          onEnded: (g) => {
            if (randomness === 'dynamic' && fireByRate(rateMap[metaRandomness])) {
              g.eraseSequenceNotes()
            } else {
              g.resetNotes(kick2)
            }
          },
        },
        {
          generator: {
            scale: snareHHScale,
            note: {
              duration: 1,
            },
            sequence: {
              length: fillSequenceLengthMap[metaRandomness],
              division: 16,
              density: (2 + numOfNotesMap[saturation]) / 16,
              polyphony: 'mono',
            },
          },
          notes: snare,
          loops: 2,
          onElapsed: (g) => g.mutate({ rate: rateMap[randomness], strategy: 'inPlace' }),
          onEnded: (g) => g.resetNotes(snare),
        },
      ],
    }
  }

export const dnbDrums =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (_, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const numOfNotesMap: Record<Saturation, number> = {
      thin: 5,
      neutral: 6,
      thick: 7,
    }
    const rateMap: Record<Randomness, number> = {
      static: 0,
      hybrid: 0.1,
      dynamic: 0.3,
    }
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
              density: numOfNotesMap[saturation] / 16,
              polyphony: 'mono',
            },
            notes: dnb,
          },
          loops: 4,
          onElapsed: (g) => g.mutate({ rate: rateMap[randomness], strategy: 'move' }),
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
              density: numOfNotesMap[saturation] / 16,
              polyphony: 'mono',
              lenRange: {
                min: 8,
                max: 24,
              },
            },
            notes: fill,
          },
          loops: 2,
          onElapsed: (g) => g.mutate({ rate: rateMap[randomness], strategy: 'move' }),
          onEnded: (g) => {
            if (metaRandomness === 'dynamic') {
              g.changeSequenceLength('shrink', randomIntInclusiveBetween(1, 3))
            }
            g.resetNotes(fill)
          },
        },
      ],
    }
  }
