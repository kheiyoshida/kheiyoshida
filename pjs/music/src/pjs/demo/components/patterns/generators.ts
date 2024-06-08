import { Scale, createGenerator } from 'mgnr-tone'

export const generateLongSequences = (scale: Scale) => {
  const generator = createGenerator({
    scale,
    sequence: {
      length: 8,
      division: 2,
      density: 0.6,
      polyphony: 'mono',
    },
    note: {
      duration: {
        min: 4,
        max: 8,
      },
    },
  })
  return generator
}

export const randomSequence = (scale: Scale) =>
  createGenerator({
    scale,
    sequence: {
      length: 12,
      division: 16,
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
