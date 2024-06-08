import { Scale, changeSequenceLength, createGenerator, pingpongSequenceLength } from 'mgnr-tone'

export const generateLongSequences = (scale: Scale) => {
  const generator = createGenerator({
    scale,
    sequence: {
      length: 16,
      division: 1,
      density: 1,
      polyphony: 'mono',
    },
    note: {
      duration: {
        min: 1,
        max: 4,
      },
    },
  })
  return generator
}

export const addHarmonyToLongSequence = (scale: Scale) =>
  createGenerator({
    scale,
    sequence: {
      length: 6,
      division: 1,
      density: 0.3,
      polyphony: 'mono',
    },
    note: {
      duration: {
        min: 1,
        max: 4,
      },
    },
  })

export const movingSequence = (scale: Scale) =>
  createGenerator({
    scale,
    sequence: {
      length: 16,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 4,
      },
    },
  })

export const randomSequence = (scale: Scale, density: number) =>
  createGenerator({
    scale,
    sequence: {
      length: 12,
      division: 16,
      density,
      polyphony: 'mono',
    },
    note: {
      duration: {
        min: 1,
        max: 2,
      },
    },
  })

export const randomBassline = (scale: Scale) =>
  createGenerator({
    scale,
    sequence: {
      length: 16,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
    },
    note: {
      duration: {
        min: 1,
        max: 8,
      },
    },
  })

export const randomise = (scale: Scale) =>
  createGenerator({
    scale,
    sequence: {
      length: 10,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
    },
    note: {
      duration: {
        min: 1,
        max: 2,
      },
    },
  })

export const strictArpegio = (scale: Scale) =>
  createGenerator({
    scale,
    sequence: {
      length: 12,
      lenRange: {
        min: 4, 
        max: 24
      },
      division: 16,
      density: 1,
      polyphony: 'mono',
    },
    note: {
      duration: 1,
    },
    middlewares: {
      changeLength: pingpongSequenceLength('extend'),
    },
  })
