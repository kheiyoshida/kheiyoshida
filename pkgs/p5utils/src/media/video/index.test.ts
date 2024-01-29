import { calcPixelSize } from '../pixel/pixels'

test(`${calcPixelSize.name}`, () => {
  const size = { width: 960, height: 540 }
  expect(calcPixelSize(size, 4, 960, 540)).toMatchObject({ pxw: 4, pxh: 4 })
  expect(calcPixelSize(size, 4, 480, 1080)).toMatchObject({ pxw: 2, pxh: 8 })
})
