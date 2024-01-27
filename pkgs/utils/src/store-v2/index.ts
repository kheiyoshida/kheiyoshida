type State = Record<string, unknown>

type Reducer<S extends State> = (state: S) => (...args: never[]) => void

export type ReducerMap<S extends State> = Record<string, Reducer<S>>

interface Store<S> {
  init: (initialState: S) => void
  update: <K extends keyof S>(key: K, val: ((v: S[K]) => S[K]) | S[K]) => void
  bulkUpdate: (newState: Partial<S>) => void
  read(): Readonly<S>
  read<K extends keyof S>(key: K): Readonly<S>[K]
  current: S
}

type StoreWithReducers<S extends State, RM extends ReducerMap<S>> = Store<S> & {
  [k in keyof RM]: ReturnType<RM[k]>
}

export const makeStoreV2 =
  <S extends State>() =>
  <RM extends ReducerMap<S>>(rm: RM): StoreWithReducers<S, RM> => {
    let state: Readonly<S>

    /**
     * update field of state using old value. It will renew the whole state object
     */
    const update = <K extends keyof S>(key: K, val: ((v: S[K]) => S[K]) | S[K]) => {
      if (val instanceof Function) {
        _update(key, val(state[key]))
      } else {
        _update(key, val)
      }
    }

    const _update = <K extends keyof S>(key: K, newVal: S[K]) => {
      state = { ...state, [key]: newVal }
    }

    /**
     * update state in bulk
     * @param newState partial fields of entire state
     */
    const bulkUpdate = (newState: Partial<S>) => {
      state = { ...state, ...newState }
    }

    function read(): Readonly<S>
    function read<K extends keyof S>(key: K): Readonly<S>[K]
    function read<K extends keyof S>(key?: K) {
      return key ? state[key] : state
    }

    const bound = Object.fromEntries(
      Object.entries(rm).map(([k, r]) => [k, (...args) => r(state)(...args)])
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
      update,
      read,
      bulkUpdate,
      get current() {
        return state
      },
    }
  }
