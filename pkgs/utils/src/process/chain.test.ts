import { ChainProcess, MakeChainProcess, makeChain } from './chain'

describe('chain', () => {
  beforeAll(() => jest.useFakeTimers())
  afterAll(() => jest.useRealTimers())
  it('should recursively execute processes', () => {
    const fn = jest.fn()
    const next: MakeChainProcess =
      (calls = 1) =>
      () => {
        fn()
        return calls < 3 ? [next(calls + 1)] : [null]
      }
    const chain = makeChain([next(1)], 10)
    chain.start()

    expect(fn).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(2)
    jest.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(3)
    jest.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(3)
  })
  it('can change the execution interval', () => {
    const fn = jest.fn()
    const next: MakeChainProcess =
      (calls = 1) =>
      () => {
        calls += 1
        fn()
        return calls < 10 ? [next(calls + 1)] : [null]
      }
    const chain = makeChain([next(1)], 10)

    //
    chain.start()
    expect(fn).toHaveBeenCalledTimes(1)

    //
    chain.changeInterval(20)
    jest.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(2)

    //
    jest.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(2)

    //
    jest.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(3)

    //
    jest.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(3)
  })
  it('can increase the number of processes during execution', () => {
    const fn = jest.fn()
    const next: MakeChainProcess =
      (calls = 1): ChainProcess =>
      () => {
        fn()
        return calls < 10 ? [next(calls + 1), next(calls + 1)] : [null]
      }
    const chain = makeChain([next(0)], 10)

    // 1
    chain.start()
    expect(fn).toHaveBeenCalledTimes(1)

    // 2
    jest.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(3)

    // 3
    jest.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(7)

    // 4
    jest.advanceTimersByTime(10)
    expect(fn.mock.calls.length).toMatchInlineSnapshot(`15`)

    // continues
    jest.advanceTimersByTime(10)
    expect(fn.mock.calls.length).toMatchInlineSnapshot(`31`)
    jest.advanceTimersByTime(10)
    expect(fn.mock.calls.length).toMatchInlineSnapshot(`63`)
    jest.advanceTimersByTime(10)
    expect(fn.mock.calls.length).toMatchInlineSnapshot(`127`)
    jest.advanceTimersByTime(10)
    expect(fn.mock.calls.length).toMatchInlineSnapshot(`255`)
  })
})
