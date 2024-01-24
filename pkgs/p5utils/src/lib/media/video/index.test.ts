import * as utils from 'utils'
import { calcPixelSize, makeParseOptionSelector, makeVideoSupply } from '.'
import * as source from './source'
import { p5VideoElement } from './types'

jest.mock('utils', () => ({
  __esModule: true,
  ...jest.requireActual('utils'),
}))

describe(`${makeVideoSupply.name}`, () => {
  it(`should create a supply`, () => {
    const sourceList = ['source_1', 'source_2']
    const mockVideoElements = sourceList.map(
      () =>
        ({
          speed: jest.fn(),
          play: jest.fn(),
          onended: jest.fn(),
          stop: jest.fn(),
        }) as unknown as p5VideoElement
    )
    jest.spyOn(source, 'loadVideoSourceList').mockReturnValue(mockVideoElements)
    jest.spyOn(source, 'waitForVideosToLoad').mockResolvedValue(true)
    jest
      .spyOn(utils, 'makeRandomItemPicker')
      .mockImplementationOnce((arr) => () => arr[0])
      .mockImplementationOnce((arr) => () => arr[1])
    const supply = makeVideoSupply(sourceList, { speed: 0.1 })
    const video = supply.supply()
    expect(video).toBe(mockVideoElements[0])
    expect(video.speed).toHaveBeenCalledWith(0.1)
    expect(video.play).toHaveBeenCalled()
    expect(video.onended).toHaveBeenCalled()

    supply.updateOptions({ speed: 0.2 })
    expect(video.speed).toHaveBeenCalledWith(0.2)

    const video2 = supply.renew()
    expect(video.stop).toHaveBeenCalled()
    expect(video2.speed).toHaveBeenCalledWith(0.2)
    expect(video2.play).toHaveBeenCalled()
    expect(video2.onended).toHaveBeenCalled()
  })
})

describe(`${makeParseOptionSelector.name}`, () => {
  const size = {
    width: 960,
    height: 540,
  }
  describe(`magnify`, () => {
    it(`should initialize`, () => {
      const selector = makeParseOptionSelector(size, 160)
      const option = selector.get()
      expect(option.position).toMatchObject({ x: 480, y: 270 })
      expect(option.size).toMatchObject(size)
      expect(option.skip).toBe(960 / 160)
      expect(selector.getCurrentPosition()).toMatchObject({ x: 480, y: 270 })
    })
    it(`can change the magnification`, () => {
      const selector = makeParseOptionSelector(size, 160)
      jest.spyOn(utils, 'randomIntBetween').mockReturnValue(3)
      selector.randomMagnify()
      const option = selector.get()
      expect(option.position).toMatchObject({ x: 480, y: 270 })
      expect(option.size).toMatchObject({ width: 480, height: 270 }) // 2x (=1/2 of original) size
      expect(option.skip).toBe(480 / 160)
      expect(selector.getCurrentPosition()).toMatchObject({ x: 480, y: 270 })
    })
  })
  describe(`position`, () => {
    it(`can change position under the restriction`, () => {
      const selector = makeParseOptionSelector(size, 160)
      expect(selector.getCurrentPosition()).toMatchObject({ x: 480, y: 270 })
      selector.changePosition((p) => ({ x: p.x + 2, y: p.y + 2 }))
      expect(selector.getCurrentPosition()).toMatchObject({ x: 480, y: 270 }) // restricted

      jest.spyOn(utils, 'randomIntBetween').mockReturnValue(3)
      selector.randomMagnify()
      selector.changePosition((p) => ({ x: p.x + 2, y: p.y + 2 }))
      expect(selector.getCurrentPosition()).toMatchObject({ x: 482, y: 272 }) // not restricted
    })
  })
})

test(`${calcPixelSize.name}`, () => {
  const size = { width: 960, height: 540}
  expect(calcPixelSize(size, 4, 960, 540)).toMatchObject({pxw: 4, pxh: 4})
  expect(calcPixelSize(size, 4, 480, 1080)).toMatchObject({pxw: 2, pxh: 8})
})
