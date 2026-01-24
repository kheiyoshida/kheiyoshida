import { Range, clamp } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'
import { createScaleRange } from './utils/scale'
import { RandomLevel, convertRandomLevel } from './utils/randomness'
import { SequenceConf } from 'mgnr-tone'

const NoteLengthMap: Record<RandomLevel, number | Range> = {
  1: 4,
  2: 4,
  3: 2,
  4: 2,
  5: 2,
  6: {
    min: 1,
    max: 2,
  },
  7: {
    min: 2,
    max: 3,
  },
  8: {
    min: 1,
    max: 4,
  },
  9: {
    min: 1,
    max: 4,
  },
}

const divisionMap: Record<RandomLevel, SequenceConf['division']> = {
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 2,
  7: 4,
  8: 8,
  9: 8,
}

const SequenceLengthMap: Record<Randomness, number> = {
  static: 8,
  hybrid: 4,
  dynamic: 4,
}

export const thinPad =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    const CenterOctaveMap: Record<Saturation, [number, number]> = {
      thin: [60, 3],
      neutral: [60, 2],
      thick: [60, 2],
    }
    const scale = source.createScale({ range: createScaleRange(...CenterOctaveMap[saturation]) })
    return {
      outId: 'pad',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: SequenceLengthMap[metaRandomness],
              division: divisionMap[randomLevel],
              density: 1,
              polyphony: 'poly',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteLengthMap[randomLevel],
              harmonizer: {
                degree: ['6'],
              },
            },
          },
          loops: 1,
          onElapsed: () => undefined,
          onEnded: (g) => {
            g.resetNotes()
          },
        },
      ],
    }
  }

export const defaultPad =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    const CenterOctaveMap: Record<Saturation, [number, number]> = {
      thin: [68, 1],
      neutral: [56, 1.4],
      thick: [60, 2.6],
    }
    const scale = source.createScale({ range: createScaleRange(...CenterOctaveMap[saturation]) })
    const MultiLayerDensityMap: Record<Randomness, number> = {
      static: 1,
      hybrid: 2,
      dynamic: 1.5,
    }
    return {
      outId: 'pad',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: SequenceLengthMap[metaRandomness],
              division: divisionMap[randomLevel],
              density: 1,
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteLengthMap[randomLevel],
            },
          },
          loops: 1,
          onElapsed: () => undefined,
          onEnded: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'inPlace' })
            g.resetNotes()
          },
        },
        {
          generator: {
            scale,
            sequence: {
              length: 6,
              division: divisionMap[randomLevel],
              density: MultiLayerDensityMap[metaRandomness],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration:
                typeof NoteLengthMap[randomLevel] === 'number'
                  ? clamp(NoteLengthMap[randomLevel] as number, 1, 6)
                  : NoteLengthMap[randomLevel],
            },
          },
          loops: 1,
          onElapsed: () => undefined,
          onEnded: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'randomize' })
          },
        },
      ],
    }
  }

export const thickPad =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    const CenterOctaveMap: Record<Saturation, [number, number]> = {
      thin: [60, 2.6],
      neutral: [60, 3],
      thick: [66, 4],
    }
    const scale = source.createScale({ range: createScaleRange(...CenterOctaveMap[saturation]) })
    const MultiLayerDensityMap: Record<Randomness, number> = {
      static: 0.5,
      hybrid: 1,
      dynamic: 1.5,
    }
    return {
      outId: 'pad',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: SequenceLengthMap[metaRandomness],
              division: divisionMap[randomLevel],
              density: 2,
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteLengthMap[randomLevel],
              harmonizer: {
                degree: ['6'],
              },
            },
          },
          loops: 1,
          onElapsed: () => undefined,
          onEnded: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'inPlace' })
            g.resetNotes()
          },
        },
        {
          generator: {
            scale,
            sequence: {
              length: 6,
              division: divisionMap[randomLevel],
              density: MultiLayerDensityMap[metaRandomness],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration:
                typeof NoteLengthMap[randomLevel] === 'number'
                  ? clamp(NoteLengthMap[randomLevel] as number, 1, 6)
                  : NoteLengthMap[randomLevel],
            },
          },
          loops: 1,
          onElapsed: () => undefined,
          onEnded: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'randomize' })
          },
        },
      ],
    }
  }
