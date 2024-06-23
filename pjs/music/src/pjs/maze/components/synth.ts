import { Range } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'
import { RandomLevel, convertRandomLevel } from './utils/randomness'
import { createScaleRange } from './utils/scale'

const NoteLengthMap: Record<RandomLevel, number | Range> = {
  1: 12,
  2: 12,
  3: 8,
  4: 8,
  5: 8,
  6: {
    min: 6,
    max: 8,
  },
  7: {
    min: 4,
    max: 8,
  },
  8: {
    min: 2,
    max: 6,
  },
  9: {
    min: 1,
    max: 6,
  },
}

const SequenceLengthMap: Record<Randomness, number> = {
  static: 8,
  hybrid: 4,
  dynamic: 4,
}

const MultiLayerSequenceLengthMap: Record<Randomness, number> = {
  static: 8,
  hybrid: 6,
  dynamic: 5,
}

const DensityMap: Record<Saturation, number> = {
  thin: 0.1,
  neutral: 0.3,
  thick: 0.5,
}

export const synth =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    const CenterOctaveMap: Record<Saturation, [number, number]> = {
      thin: [84, 1],
      neutral: [80, 1.4],
      thick: [74, 2],
    }
    const scale = source.createScale({ range: createScaleRange(...CenterOctaveMap[saturation]) })

    return {
      outId: 'synth',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: SequenceLengthMap[metaRandomness],
              division: 16,
              density: DensityMap[saturation],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteLengthMap[randomLevel],
              durationStrategy: 'fixed'
            },
          },
          loops: 4,
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
              length: MultiLayerSequenceLengthMap[randomness],
              division: 16,
              density: DensityMap[saturation],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteLengthMap[randomLevel],
              durationStrategy: 'fixed'
            },
          },
          loops: 4,
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
