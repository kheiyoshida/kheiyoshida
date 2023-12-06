import { random } from './calc'
import { Range } from './types'

export const findDelete = <T>(arr: T[], del: T) => {
  const i = arr.indexOf(del)
  if (i == -1) {
    throw Error(`could not find item`)
  }
  arr.splice(i, 1)
}

export const normalizeRange = (rangeValue: number | Range) => {
  if (typeof rangeValue === 'number') {
    return rangeValue
  } else {
    return rangeValue.max
  }
}

export function randomRemove<T>(items: T[], rmRate = 0.5) {
  const [survived, removed]: T[][] = [[], []]
  items.forEach(itm => {
    random(rmRate) ? removed.push(itm) : survived.push(itm)
  })
  return [survived, removed]
}

/**
 * negate a bool value if condition is true
 * @param condition condition to determine if it should negate the bool value
 * @param value boolean value 
 * @returns 
 */
export function negateIf  (condition:boolean, value: boolean) {
  if (condition) {
    return !value
  }
  return value
}

/**
 * build config merging with default values
 */
export const buildConf = <T extends { [k: string]: any }>(
  defaults: T,
  values: Partial<T>
): T => {
  Object.keys(values).forEach((k) => {
    if (values[k] === undefined) {
      delete values[k]
    }
  })
  return {
    ...defaults,
    ...values,
  }
}

/**
 * Pick subset of object from keys
 */
export const pick = <T extends object>(
  obj: T,
  keyArray: Array<keyof T>
) => {
  return Object.fromEntries(
    keyArray.map((k) => [k, obj[k]] )
  )
}
