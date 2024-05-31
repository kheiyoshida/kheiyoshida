type SequenceContext = {
  config: {
    foo: number
  }
}

type MiddlewareMap = Record<string, Middleware>
type InjectedMiddlewares<MW extends MiddlewareMap> = {
  [k in keyof MW]: ReturnType<MW[k]>
}

type Generator<MW extends MiddlewareMap> = SequenceContext & InjectedMiddlewares<MW>

type Middleware = (ctx: SequenceContext) => (...params: never[]) => void

export const createGenerator = <MW extends MiddlewareMap>(
  context: SequenceContext,
  middlewares: MW
): Generator<MW> => {
  const injected = Object.fromEntries(
    Object.entries(middlewares).map(([k, mw]) => [k, (...args) => mw(context)(...args)])
  ) as InjectedMiddlewares<MW>
  return {
    ...context,
    ...injected,
  }
}
