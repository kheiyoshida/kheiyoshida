import { ImageResolution } from './types'
import { ImageScope } from './scope/scope'
import { PixelParser } from './parse'

// Replace your mock with this for the PixelParser test
const createRGBAByCoord = ({ width, height }: ImageResolution) => {
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
  const originalImageSize: ImageResolution = { width: 32, height: 18 } // 16:9
  const finalResolutionWidth = 16
  const parser = new PixelParser(new ImageScope(originalImageSize, finalResolutionWidth))
  expect(parser.scope.parseParams.scopedSize).toMatchObject({ width: 32, height: 18 })
  expect(parser.scope.parseParams.pixelSkip).toBe(2)
  expect(parser.parseResult.length).toBe(16 * 9 * 4)

  const rawPixelData = createRGBAByCoord(originalImageSize)
  const result = parser.parsePixelData(rawPixelData)

  // Assert we’re sampling every `skip` along rows/cols:
  const wOut = finalResolutionWidth // or compute expected output width
  const skip = parser.scope.parseParams.pixelSkip

  // First pixel should be y=0, x=0  -> [0,0,0,255]
  expect(result.slice(0, 4)).toEqual(Uint8Array.of(0, 0, 0, 255))

  // Next sampled pixel in the same row should be x=skip -> [0, skip, 0, 255]
  expect(result.slice(4, 8)).toEqual(Uint8Array.of(0, skip, 0, 255))

  // The first pixel of the second sampled row should be y=skip, x=0
  expect(result.slice(wOut * 4, wOut * 4 + 4)).toEqual(Uint8Array.of(skip, 0, 0, 255))
})
