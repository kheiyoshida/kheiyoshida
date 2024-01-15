/* eslint-disable @typescript-eslint/no-empty-function */
import { Outlet } from './Outlet'
import { createGenerator } from './commands'

export class MockOutlet extends Outlet<unknown> {
  loopSequence(loop?: number, startTime?: number) {
    return this
  }
  methodUsingGenerator() {
    return this.generator.notes
  }
}

describe(`${Outlet.name}`, () => {
  it(`should throw when generator is absent`, () => {
    const out = new MockOutlet('foo')
    expect(() => out.methodUsingGenerator()).toThrow()
  })
  it(`can set generator`, () => {
    const out = new MockOutlet('foo')
    out.generator = createGenerator({})
    expect(() => out.methodUsingGenerator()).not.toThrow()
  })
})
