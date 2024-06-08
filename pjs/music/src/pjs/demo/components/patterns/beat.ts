import { Scale, createGenerator } from 'mgnr-tone'
import { backHH, dnb, kick4 } from './sequences'

export const dnbBeat = (scale: Scale, density: number) =>
  createGenerator({
    scale,
    note: {
      duration: 1,
    },
    sequence: {
      fillStrategy: 'fixed',
      length: 16,
      division: 16,
      density: density,
      polyphony: 'mono',
    },
    notes: dnb,
  })

export const randomFill = (scale: Scale, density: number) =>
  createGenerator({
    scale,
    note: {
      duration: 1,
    },
    sequence: {
      fillStrategy: 'fill',
      length: 16,
      division: 16,
      density: density,
      polyphony: 'mono',
    },
    notes: backHH,
  })

export const kicks = (scale: Scale, density: number) =>
  createGenerator({
    scale,
    note: {
      duration: 1,
    },
    sequence: {
      fillStrategy: 'fill',
      length: 16,
      division: 16,
      density: density,
      polyphony: 'mono',
    },
    notes: kick4,
  })
