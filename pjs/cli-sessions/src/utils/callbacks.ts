/* eslint-disable no-console */
import { SequenceGenerator } from '@mgnr/cli'

export const cb = (fn: (g: SequenceGenerator) => void) => (g: SequenceGenerator) => {
  try {
    fn(g)
  } catch (e) {
    console.error(e)
  }
}

export const resetNotes = (g: SequenceGenerator) => g.resetNotes()

export const extend = (amount: number) => (g: SequenceGenerator) => {
  g.sequence.extend(amount)
  g.constructNotes()
}

export const shrink = (amount: number) => (g: SequenceGenerator) => {
  g.sequence.shrink(amount)
  g.constructNotes()
}

export const mutateInPlace = (rate: number) => (g: SequenceGenerator) =>
  g.mutate({ rate, strategy: 'inPlace' })

export const rand = (rate: number) => (g: SequenceGenerator) => g.mutate({ rate, strategy: 'randomize' })
