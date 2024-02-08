import type { MatcherFunction } from '@jest/expect'
import { expect } from '@jest/globals'

const toBeSameValueArray: MatcherFunction<[value: unknown]> =
  function (received) {
    if (!Array.isArray(received)) {
      throw TypeError('must be an array')
    }
    if (!received.length){
      throw Error('empty array given')
    }

    for(let i = 0; i< received.length; i++) {
      for(let j = 0; j< received.length; j++) {
        if (received[i] !== received[j]) {
          return {
            pass: false,
            message: () => `values differ: ${i} ${received[i]} and ${j} ${received[j]}`
          }
        }
      }
    }
    return {
      pass: true,
      message: () => 'values are same in this array'
    }
  }

expect.extend({
  toBeSameValueArray,
})

declare module '@jest/expect' {
  interface AsymmetricMatchers {
    toBeSameValueArray(): void
  }
  interface Matchers<R> {
    toBeSameValueArray(): R
  }
}
