// eslint-disable-next-line @typescript-eslint/ban-types
export const makeStore = <T extends Object>() => {
  let data: Readonly<T>

  const init = (initialValue: T) => {
    if (data) {
      throw new Error(`already initialized`)
    }
    data = initialValue
  }

  /**
   * update field of state using new value. It will renew the whole state object
   */
  const _update = <K extends keyof T>(key: K, newVal: T[K]) => {
    data = { ...data, [key]: newVal }
  }

  /**
   * update field of state using old value. It will renew the whole state object
   */
  const update = <K extends keyof T>(key: K, val: ((v: T[K]) => T[K]) | T[K]) => {
    if (val instanceof Function) {
      _update(key, val(data[key]))
    } else {
      _update(key, val)
    }
  }

  /**
   * update state in bulk
   * @param newState partial fields of entire state
   */
  const bulkUpdate = (newState: Partial<T>) => {
    data = { ...data, ...newState }
  }

  /**
   * read a field of state.
   * If key is not provided, returns the entire state
   */
  const read: {
    <K extends keyof T>(key: K): Readonly<T>[K]
    (): Readonly<T>
  } = <K extends keyof T>(key?: K) => (key ? data[key] : data)

  return { init, update, read, bulkUpdate }
}
