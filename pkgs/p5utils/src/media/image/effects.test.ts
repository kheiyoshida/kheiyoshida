import p5 from 'p5'
import { pipe } from 'utils'
import {
  applyBlackAndWhiteFilter,
  applyBlurFilter,
  applyMonochromeFilter,
  applyRandomSwap,
} from './effects'

test(`effects can be piped`, () => {
  const img = new p5.Image(100, 100)
  const spyFilter = jest.spyOn(img, 'filter').mockImplementation()
  const spyCopy = jest.spyOn(img, 'copy').mockImplementation()
  pipe(
    img,
    applyBlackAndWhiteFilter(0.5),
    applyBlurFilter(4),
    applyMonochromeFilter,
    applyRandomSwap(4, 100)
  )
  expect(spyFilter.mock.calls[0]).toMatchObject(['threshold', 0.5])
  expect(spyFilter.mock.calls[1]).toMatchObject(['blur', 4])
  expect(spyFilter.mock.calls[2]).toMatchObject(['gray'])
  expect(spyFilter.mock.calls[2]).toMatchObject(['gray'])
  expect(spyCopy).toHaveBeenCalledTimes(4)
})
