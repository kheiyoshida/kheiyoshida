import type { MatcherFunction } from '@jest/expect'
import { expect } from '@jest/globals'

const toMatchCloseObject: MatcherFunction<[expect: unknown, diffRange: number]> =
  function (received, expect, diffRange = 0.02) {
    if (typeof received !== 'object' || typeof expect !== 'object') {
      throw TypeError('must be object')
    }
    const r = received as Record<string, unknown>
    const e = expect as Record<string, unknown>
    for(const k in expect) {
      if (!(k in r)) {
        return {
          pass: false,
          message: () => `key ${k} doesn't exist in the received object`
        }
      }
      const rv = r[k]
      const ev = e[k]
      if (typeof rv !== 'number' || typeof ev !== 'number') {
        throw TypeError('values must be number')
      }
      if (Math.abs(rv - ev) > diffRange) {
        return {
          pass: false,
          message: () => `value for field ${k} is not close: ${rv} ${ev}`
        }
      }
    }
    return {
      pass: true,
      message: () => 'values in the two objects are close enough'
    }
  }

expect.extend({
  toMatchCloseObject,
})

declare module '@jest/expect' {
  interface AsymmetricMatchers {
    toMatchCloseObject(expect: unknown, diffRange?: number): void
  }
  interface Matchers<R> {
    toMatchCloseObject(expect: unknown, diffRange?: number): R
  }
}
