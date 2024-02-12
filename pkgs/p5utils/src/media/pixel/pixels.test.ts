import { convertPixelDataIntoMatrix, iteratePixels } from './pixels'
import { MediaSize } from './types'

const createMockPixelData = ({ width, height }: MediaSize) =>
  [...new Array(width * height * 4)].map((_, i) => i)

test(`${iteratePixels.name}`, () => {
  const mediaSize = { width: 4, height: 4 }
  const iterate = jest.fn()
  iteratePixels(mediaSize, iterate)
  expect(iterate).toHaveBeenCalledTimes(mediaSize.width * mediaSize.height)
  iterate.mock.calls.forEach(call => {
    expect(call[1]).toBeLessThan(mediaSize.width)
    expect(call[2]).toBeLessThan(mediaSize.height)
  })
})

test(`${convertPixelDataIntoMatrix.name}`, () => {
  const videoSize = { width: 16, height: 12 }
  const skip = 4 // resolution = 4p x 3p
  const magnifiedSize = { width: 8, height: 6 } // 2x
  const centerPosition = { x: 8, y: 6 }
  const mockPixelDataArray = createMockPixelData(videoSize)

  const result = convertPixelDataIntoMatrix(
    mockPixelDataArray,
    videoSize,
    skip,
    magnifiedSize,
    centerPosition
  )
  expect(result).toMatchInlineSnapshot(`
    [
      [
        [
          208,
          209,
          210,
          211,
        ],
        [
          224,
          225,
          226,
          227,
        ],
      ],
      [
        [
          464,
          465,
          466,
          467,
        ],
        [
          480,
          481,
          482,
          483,
        ],
      ],
    ]
  `)
  expect(result[0][1][0] - result[0][0][0]).toBe(skip * 4) // skip 4px
  expect(result[1][0][0] - result[0][0][0]).toBe(videoSize.width * 4 * 4) // skip 4x vertically
  expect(result[0][0][0]).toBe(centerPosition.y * skip * 4 + (centerPosition.x - 1) * skip * 4) // left top pixel
})
