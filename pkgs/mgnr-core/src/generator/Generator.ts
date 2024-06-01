import { NotePickerConf } from './NotePicker'
import { Sequence, SequenceConf } from './Sequence'
import {
  adjustPitch,
  changeSequenceLength,
  constructNotes,
  eraseSequenceNotes,
  mutate,
  resetNotes,
  updateConfig,
} from './middlewares'
import { Scale } from './scale/Scale'

import type { Tail } from 'utils'

export type Middleware = (ctx: GeneratorContext, ...params: never[]) => void
export type Middlewares = { readonly [k: string]: Middleware }

type Injected<MW extends Middleware> = (...params: Tail<Parameters<MW>>) => void
type InjectedMiddlewares<MW extends Middlewares> = {
  [k in keyof MW]: Injected<MW[k]>
}

export type SequenceGenerator<MW extends Middlewares> = GeneratorContext &
  InjectedMiddlewares<MW & typeof defaultMiddlewares>

export const createGenerator = <MW extends Middlewares>(
  context: GeneratorContext,
  middlewares: MW = <MW>{}
): SequenceGenerator<MW> => {
  const injected = Object.fromEntries(
    Object.entries({ ...defaultMiddlewares, ...middlewares }).map(([k, mw]) => [
      k,
      (...args) => mw(context, ...args),
    ])
  ) as InjectedMiddlewares<MW & typeof defaultMiddlewares>
  return {
    ...context,
    ...injected,
    get context() {
      return context
    },
    get mw() {
      return injected
    },
    get middlewares() {
      return injected
    },
  }
}

export type GeneratorConf = {
  scale?: Scale
  sequence?: Partial<SequenceConf>
  note?: Partial<NotePickerConf>
}

export type GeneratorContext = {
  sequence: Sequence
  picker: NotePickerConf
  scale: Scale
}

export const defaultMiddlewares = {
  updateConfig,
  constructNotes,
  resetNotes,
  eraseSequenceNotes,
  adjustPitch,
  changeSequenceLength,
  mutate,
} satisfies Middlewares
