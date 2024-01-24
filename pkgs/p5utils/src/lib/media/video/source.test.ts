
import { loadVideoSourceList, waitForVideosToLoad } from './source'
import { p5VideoElement } from './types'

test(`${loadVideoSourceList.name}`, () => {
  const spyCreateVideo = jest.spyOn(p, 'createVideo')
  loadVideoSourceList(['video1_loc', 'video2_loc'])
  expect(spyCreateVideo).toHaveBeenCalledTimes(2)
})

describe(`${waitForVideosToLoad.name}`, () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })
  it(`should return true when videos are loaded`, () => {
    const elms = [{ width: 300 }, { width: 300 }] as p5VideoElement[]
    const result = waitForVideosToLoad(elms)
    elms.forEach((e) => (e.width = 900))
    jest.advanceTimersByTime(10)
    expect(result).resolves.toBe(true)
  })
  it(`should reject after 10 secs`, () => {
    const elms = [{ width: 300 }, { width: 300 }] as p5VideoElement[]
    const result = waitForVideosToLoad(elms)
    jest.advanceTimersByTime(1000)
    expect(result).rejects.toThrow()
  })
})
