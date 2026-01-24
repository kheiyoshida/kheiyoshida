import { Range } from 'utils'
import { DemoComponentMaker, Randomness, Saturation, translate } from '../scenes'
import { RandomLevel, convertRandomLevel } from './utils/randomness'
import { createScaleRange } from './utils/scale'

const NoteLengthMapThin: Record<RandomLevel, number | Range> = {
  1: 12,
  2: 8,
  3: 4,
  4: {
    min: 2,
    max: 4,
  },
  5: {
    min: 1,
    max: 4,
  },
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

const DensityMapThin: Record<RandomLevel, number> = {
  1: 0.3,
  2: 0.3,
  3: 0.3,
  4: 0.4,
  5: 0.5,
  6: 0.4,
  7: 0.6,
  8: 0.7,
  9: 1.0,
}

const DensityMapMelo: Record<Saturation, number> = {
  thin: 0.3,
  neutral: 0.3,
  thick: 0.5,
}

export const thinSynth =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    const CenterOctaveMap: Record<Saturation, [number, number]> = {
      thin: [84, 1],
      neutral: [80, 1.4],
      thick: [80, 1.6],
    }

    const scale = source.createScale({ range: createScaleRange(...CenterOctaveMap[saturation]) })

    const noteDurationMap: Record<Saturation, number> = {
      thin: 12,
      neutral: 8,
      thick: 4,
    }

    return {
      outId: 'synth',
      generators: [
        {
          generator: {
            scale,
            sequence: {
              length: 8,
              division: 8,
              density: DensityMapThin[randomLevel],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: noteDurationMap[saturation],
              durationStrategy: 'fixed',
            },
          },
          loops: 4,
          onElapsed: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'inPlace' })
          },
          onEnded: (g) => {
            g.resetNotes()
          },
        },
        {
          generator: {
            scale,
            sequence: {
              length: 6,
              division: 8,
              density: DensityMapThin[randomLevel] - 0.25,
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: noteDurationMap[saturation] - 2,
              durationStrategy: 'fixed',
            },
          },
          loops: 4,
          onElapsed: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'inPlace' })
          },
          onEnded: (g) => {
            g.resetNotes()
          },
        },
      ],
    }
  }

export const melodicSynth =
  (metaRandomness: Randomness): DemoComponentMaker =>
  (source, alignment) => {
    const { randomness, saturation } = translate(alignment)
    const randomLevel = convertRandomLevel(metaRandomness, randomness)
    const CenterOctaveMap: Record<Saturation, [number, number]> = {
      thin: [72, 1],
      neutral: [66, 1.4],
      thick: [66, 2],
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
              density: DensityMapMelo[saturation],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteLengthMapThin[randomLevel],
              durationStrategy: 'fixed',
            },
          },
          loops: 4,
          onElapsed: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'inPlace' })
          },
          onEnded: (g) => {
            g.resetNotes()
          },
        },
        {
          generator: {
            scale,
            sequence: {
              length: MultiLayerSequenceLengthMap[randomness],
              division: 16,
              density: DensityMapMelo[saturation],
              polyphony: 'mono',
              fillStrategy: 'fill',
            },
            note: {
              duration: NoteLengthMapThin[randomLevel],
              durationStrategy: 'fixed',
            },
          },
          loops: 4,
          onElapsed: (g) => {
            g.mutate({ rate: randomLevel / 10, strategy: 'inPlace' })
          },
          onEnded: (g) => {
            g.resetNotes()
          },
        },
      ],
    }
  }
