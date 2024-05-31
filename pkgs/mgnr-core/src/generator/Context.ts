import type { Tail } from "utils"

type SequenceContext = {
  config: {
    foo: number
  }
}

type Middleware = (ctx: SequenceContext, ...params: never[]) => void
type Injected<MW extends Middleware> = (...params: Tail<Parameters<MW>>) => void
type Middlewares = Record<string, Middleware>
type InjectedMiddlewares<MW extends Middlewares> = {
  [k in keyof MW]: Injected<MW[k]>
}

export const createGenerator = <MW extends Middlewares>(
  context: SequenceContext,
  middlewares: MW
) => {
  const injected = Object.fromEntries(
    Object.entries(middlewares).map(([k, mw]) => [k, (...args) => mw(context, ...args)])
  ) as InjectedMiddlewares<MW>
  return {
    ...context,
    ...injected,
  }
}
