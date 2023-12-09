import { deepCopy } from "../utils"

export type StateManager<T extends Object> = ReturnType<
  ReturnType<typeof makeStore<T>>
>

export const makeStore = <T extends Object>() => {
  let data: Readonly<T>
  return (initialState: T) => {
    if (!data) {
      data = Object.freeze(deepCopy(initialState))
    }

    /**
     * update field of state using new value. It will renew the whole state object
     */
    const _update = <K extends keyof T>(key: K, newVal: T[K]) => {
      data = Object.freeze({ ...data, [key]: newVal })
    }

    /**
     * update field of state using old value. It will renew the whole state object
     */
    const update = <K extends keyof T>(key: K, val: ((v: T[K]) => T[K]) | T[K]) => {
      if(val instanceof Function) {
        _update(key, val(data[key]))
      } else {
        _update(key, val)
      }
    }

    const batchUpdate = (newState: Partial<T>) => {
      data = Object.freeze({ ...data, ...newState })
    }

    /**
     * read a field of state.
     * If key is not provided, returns the entire state
     */
    const read: {
      <K extends keyof T>(key: K): Readonly<T>[K]
      (): Readonly<T>
    } = <K extends keyof T>(key?: K) => (key ? data[key] : data)

    return { update, read, batchUpdate }
  }
}
