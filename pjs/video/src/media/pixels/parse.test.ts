import { convertPixelDataIntoMatrix, PixelParser } from './parse'
import { MediaSize } from './types'

const createMockPixelData = ({ width, height }: MediaSize) =>
  [...new Array(width * height * 4)].map((_, i) => i)

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

  // prettier-ignore
  const expectedResult = [
    208, 209, 210, 211,
    224, 225, 226, 227,
    464, 465, 466, 467,
    480, 481, 482, 483,
  ]

  expect(result).toEqual(expectedResult)
  expect(result[4] - result[0]).toBe(skip * 4) // 4 pixels (16 digits) are skipped
})

// Replace your mock with this for the PixelParser test
const createRGBAByCoord = ({ width, height }: MediaSize) => {
  const data = new Uint8Array(width * height * 4)
  let k = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      data[k++] = y // R = row (0..height-1)
      data[k++] = x // G = col (0..width-1)
      data[k++] = 0 // B
      data[k++] = 255 // A
    }
  }
  return data
}

test(`${PixelParser.name}`, () => {
  const originalImageSize: MediaSize = { width: 32, height: 18 } // 16:9
  const finalResolutionWidth = 16
  const parser = new PixelParser(originalImageSize, finalResolutionWidth)
  expect(parser.scope.size).toMatchObject({ width: 32, height: 18 })
  expect(parser.scope.skip).toBe(2)
  expect(parser.parseResult.length).toBe(16 * 9 * 4)

  const rawPixelData = createRGBAByCoord(originalImageSize)
  const result = parser.parsePixelData(rawPixelData)

  // Assert we’re sampling every `skip` along rows/cols:
  const wOut = finalResolutionWidth // or compute expected output width
  const skip = parser.scope.skip

  // First pixel should be y=0, x=0  -> [0,0,0,255]
  expect(result.slice(0, 4)).toEqual(Uint8Array.of(0, 0, 0, 255))

  // Next sampled pixel in the same row should be x=skip -> [0, skip, 0, 255]
  expect(result.slice(4, 8)).toEqual(Uint8Array.of(0, skip, 0, 255))

  // The first pixel of the second sampled row should be y=skip, x=0
  expect(result.slice(wOut * 4, wOut * 4 + 4)).toEqual(Uint8Array.of(skip, 0, 0, 255))
})
