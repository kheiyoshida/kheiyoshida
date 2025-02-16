import {
  createGenerator,
  defaultMiddlewares,
  GeneratorContext,
  Middleware,
  Scale,
  ScaleConf,
  SequenceConf,
} from 'mgnr-core'
import { LogItem } from 'stream/src/types'

export class CliScale extends Scale {
  mutateKey(key: ScaleConf['key'], stages = 1) {
    this.modulate({ key }, stages)
  }

  mutateRange(min: number, max: number): void
  mutateRange(cb: (min: number, max: number) => [number, number]): void
  mutateRange(cbOrMin: number | ((min: number, max: number) => [number, number]), max?: number) {
    if (max) {
      this.modulate({ range: { min: cbOrMin as number, max } })
    } else {
      const [min, max] = (cbOrMin as any)(this.pitchRange.min, this.pitchRange.max)
      this.modulate({ range: { min, max } })
    }
  }

  mutatePref(pref: ScaleConf['pref'], stages = 1) {
    this.modulate({ pref }, stages)
  }

  mk(...args: Parameters<typeof CliScale.prototype.mutateKey>) {
    this.mutateKey(...args)
  }

  mp(...args: Parameters<typeof CliScale.prototype.mutatePref>) {
    this.mutatePref(...args)
  }

  logName: string = ''

  logState(): LogItem {
    return {
      _: this.logName,
      k: this.key,
      p: this._conf.pref,
      r: `${this.pitchRange.min}-${this.pitchRange.max}`,
    }
  }
}

const cliMiddlewares = {
  updateDensity: (ctx: GeneratorContext, density: SequenceConf['density']) => {
    defaultMiddlewares.updateConfig(ctx, { sequence: { density } })
  },
  updateDur: (ctx, duration: number) => {
    defaultMiddlewares.updateConfig(ctx, { note: { duration } })
  },
  updateVel: (ctx: GeneratorContext, velocity: number) => {
    defaultMiddlewares.updateConfig(ctx, { note: { velocity } })
  },
  randomise(ctx: GeneratorContext, rate: number) {
    defaultMiddlewares.mutate(ctx, { strategy: 'randomize', rate })
  },
  shuffle(ctx: GeneratorContext, rate: number) {
    defaultMiddlewares.mutate(ctx, { strategy: 'move', rate })
  },
  inPlace(ctx: GeneratorContext, rate: number) {
    defaultMiddlewares.mutate(ctx, { strategy: 'inPlace', rate })
  },
  useMono: (ctx) => {
    defaultMiddlewares.updateConfig(ctx, { sequence: { polyphony: 'mono' } })
  },
  usePoly: (ctx) => {
    defaultMiddlewares.updateConfig(ctx, { sequence: { polyphony: 'poly' } })
  },
  flush: (ctx) => {
    ctx.sequence.deleteEntireNotes()
  },
} satisfies Record<string, Middleware>

export const createCliGenerator = (conf: Parameters<typeof createGenerator>[0]) => {
  return createGenerator({ ...conf, middlewares: cliMiddlewares })
}

export type CliGenerator = ReturnType<typeof createCliGenerator>
