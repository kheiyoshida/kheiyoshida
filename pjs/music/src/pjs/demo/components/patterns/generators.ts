import { GeneratorConf, Scale } from 'mgnr-tone'

export const generateLongSequences = (scale: Scale): GeneratorConf => ({
  scale,
  sequence: {
    length: 6,
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

export const addHarmonyToLongSequence = (scale: Scale): GeneratorConf => ({
  scale,
  sequence: {
    length: 4,
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

export const randomSequence = (scale: Scale, density: number): GeneratorConf => ({
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

export const randomBassline = (scale: Scale): GeneratorConf => ({
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

export const randomise = (scale: Scale): GeneratorConf => ({
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

export const strictArpegio = (scale: Scale): GeneratorConf => ({
  scale,
  sequence: {
    length: 12,
    lenRange: {
      min: 4,
      max: 24,
    },
    division: 16,
    density: 1,
    polyphony: 'mono',
  },
  note: {
    duration: 1,
  },
})
