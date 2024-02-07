import { MatcherFunction } from '@jest/expect'

const toBeYeah: MatcherFunction<[yeah: unknown]> = function (received, yeah) {
  return yeah === 'yeah'
    ? {
        pass: true,
        message: () => 'it is yeah',
      }
    : { pass: false, message: () => 'it is not yeah' }
}

expect.extend({ toBeYeah })

declare module '@jest/expect' {
  interface AsymmetricMatchers {
    toBeYeah(yeah: unknown): void
  }
  interface Matchers<R> {
    toBeYeah(yeah: unknown): R
  }
}
