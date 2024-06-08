import { Scale, createGenerator } from 'mgnr-tone'

export const generateLongSequences = (scale: Scale) => {
  const generator = createGenerator({
    scale,
    sequence: {
      length: 4,
      division: 2,
      density: 1,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 2,
      },
    },
  })
  return generator
}

