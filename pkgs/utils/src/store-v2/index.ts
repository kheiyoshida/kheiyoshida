export type State = Record<string, unknown>

type Reducer<S extends State> = (state: S) => (...args: never[]) => void

export type ReducerMap<S extends State> = Record<string, Reducer<S>>

interface Store<S> {
  /**
   * initialize state
   */
  init: (initialState: S) => void

  /**
   * current state
   */
  current: Readonly<S>
}

type StoreWithReducers<S extends State, RM extends ReducerMap<S>> = Store<S> & {
  [k in keyof RM]: ReturnType<RM[k]>
}

export const makeStoreV2 =
  <S extends State>() =>
  <RM extends ReducerMap<S>, K extends keyof S>(reducerMap: RM): StoreWithReducers<S, RM> => {
    let state: Readonly<S>

    const bound = Object.fromEntries(
      Object.entries(reducerMap).map(([k, reducer]) => [k, (...args) => reducer(state)(...args)])
    ) as {
      [k in keyof RM]: ReturnType<RM[k]>
    }

    return {
      ...bound,
      init: (initialState: S) => {
        if (state) {
          throw new Error(`already initialized`)
        }
        state = initialState
      },
      get current() {
        return state
      },
    }
  }
