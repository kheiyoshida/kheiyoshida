import * as utils from 'utils'
import { makeParseOptionSelector } from '.'
import { calcPixelSize } from './pixels'

jest.mock('utils', () => ({
  __esModule: true,
  ...jest.requireActual('utils'),
}))


describe(`${makeParseOptionSelector.name}`, () => {
  const size = {
    width: 960,
    height: 540,
  }
  describe(`magnify`, () => {
    it(`should initialize`, () => {
      const selector = makeParseOptionSelector(size, 160)
      const option = selector.currentOptions
      expect(option.position).toMatchObject({ x: 480, y: 270 })
      expect(option.size).toMatchObject(size)
      expect(option.skip).toBe(960 / 160)
      expect(option.position).toMatchObject({ x: 480, y: 270 })
    })
    it(`can change the magnification`, () => {
      const selector = makeParseOptionSelector(size, 160)
      jest.spyOn(utils, 'randomIntInclusiveBetween').mockReturnValue(2)
      selector.randomMagnify()
      const option = selector.currentOptions
      expect(option.position).toMatchObject({ x: 480, y: 270 })
      expect(option.size).toMatchObject({ width: 480, height: 270 }) // 2x (=1/2 of original) size
      expect(option.skip).toBe(480 / 160)
      expect(option.position).toMatchObject({ x: 480, y: 270 })
    })
  })
  describe(`position`, () => {
    it(`can change position under the restriction`, () => {
      const selector = makeParseOptionSelector(size, 160)
      expect(selector.currentOptions.position).toMatchObject({ x: 480, y: 270 })
      selector.changePosition((p) => ({ x: p.x + 2, y: p.y + 2 }))
      expect(selector.currentOptions.position).toMatchObject({ x: 480, y: 270 }) // restricted

      jest.spyOn(utils, 'randomIntInclusiveBetween').mockReturnValue(2)
      selector.randomMagnify()
      selector.changePosition((p) => ({ x: p.x + 2, y: p.y + 2 }))
      expect(selector.currentOptions.position).toMatchObject({ x: 482, y: 272 }) // not restricted
    })
  })
})

test(`${calcPixelSize.name}`, () => {
  const size = { width: 960, height: 540}
  expect(calcPixelSize(size, 4, 960, 540)).toMatchObject({pxw: 4, pxh: 4})
  expect(calcPixelSize(size, 4, 480, 1080)).toMatchObject({pxw: 2, pxh: 8})
})
