import { GeneratorConf, Scale } from 'mgnr-tone'

export const dnbBeat = (scale: Scale, density: number): GeneratorConf => ({
  scale,
  note: {
    duration: 1,
  },
  sequence: {
    length: 16,
    division: 16,
    density: density,
    polyphony: 'mono',
  },
})

export const randomFill = (scale: Scale, density: number): GeneratorConf => ({
  scale,
  sequence: {
    length: 16,
    division: 16,
    density: density,
    polyphony: 'mono',
  },
  note: {
    duration: 1,
  },
})

export const kicks = (scale: Scale, density: number): GeneratorConf => ({
  scale,
  note: {
    duration: 1,
  },
  sequence: {
    length: 16,
    division: 16,
    density: density,
    polyphony: 'mono',
  },
})
