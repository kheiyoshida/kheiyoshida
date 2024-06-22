import { Range, clamp } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'
import { createScaleRange } from './utils/scale'
import { RandomLevel, convertRandomLevel } from './utils/randomness'
import { SequenceConf } from 'mgnr-tone'

export const thinPad =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    return {
      outId: 'pad',
      generators: [],
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
    const SequenceLengthMap: Record<Randomness, number> = {
      static: 16,
      hybrid: 8,
      dynamic: 8,
    }
    const NoteLengthMap: Record<RandomLevel, number | Range> = {
      1: 16,
      2: 16,
      3: 8,
      4: 8,
      5: 4,
      6: {
        min: 2,
        max: 4,
      },
      7: {
        min: 1,
        max: 4,
      },
      8: {
        min: 1,
        max: 3,
      },
      9: {
        min: 1,
        max: 2,
      },
    }
    const MultiLayerDensityMap: Record<Randomness, number> = {
      static: 1,
      hybrid: 1,
      dynamic: 1.5,
    }
    const divisionMap: Record<RandomLevel, SequenceConf['division']> = {
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
      6: 1,
      7: 2,
      8: 4,
      9: 4,
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
          loops: 2,
          onElapsed: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'inPlace' })
          },
          onEnded: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'randomize' })
          },
        },
        {
          generator: {
            scale,
            sequence: {
              length: 12,
              division: divisionMap[randomLevel],
              density: MultiLayerDensityMap[metaRandomness],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration:
                typeof NoteLengthMap[randomLevel] === 'number'
                  ? clamp(NoteLengthMap[randomLevel] as number, 1, 12)
                  : NoteLengthMap[randomLevel],
            },
          },
          loops: 2,
          onElapsed: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'inPlace' })
          },
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
    return {
      outId: 'pad',
      generators: [],
    }
  }
