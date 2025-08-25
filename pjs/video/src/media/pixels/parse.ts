import { ImageScope } from './scope'
import { MediaSize, PixelPosition } from './types'
import { leftTopIze } from './position'

export class PixelParser {
  public readonly scope: ImageScope

  constructor(
    originalImageSize: MediaSize,
    finalResolutionWidth: number
  ) {
    this.scope = new ImageScope(originalImageSize, finalResolutionWidth)
    this.parseResult = new Uint8Array(this.scope.finalPixelDataSize)
  }

  public readonly parseResult: Uint8Array

  public parsePixelData(
    pixels: Uint8Array,
  ): Uint8Array {
    const magnifiedSize = this.scope.size
    const skip = this.scope.skip
    const leftTopPosition = leftTopIze(this.scope.position, magnifiedSize)
    let r = 0
    for (let y = leftTopPosition.y; y < leftTopPosition.y + magnifiedSize.height; y += skip) {
      for (let x = leftTopPosition.x; x < leftTopPosition.x + magnifiedSize.width; x += skip) {
        const i = (y * this.scope.originalImageSize.width + x) * 4
        this.parseResult[r] = pixels[i]
        this.parseResult[r + 1] = pixels[i + 1]
        this.parseResult[r + 2] = pixels[i + 2]
        this.parseResult[r + 3] = pixels[i + 3]
        r += 4
      }
    }
    return this.parseResult
  }
}

/**
 * Parse media pixels and make RGBA matrix
 *
 * @param pixels pixel array of image/video
 * @param mediaSize
 * @param skip number of pixels it should skip during the parse
 * @param magnifiedSize actual size compared to the original media size. i.e. magnified
 * @param centerPosition
 * @returns
 */
export const convertPixelDataIntoMatrix = (
  pixels: number[] | Uint8ClampedArray,
  mediaSize: MediaSize,
  skip: number,
  magnifiedSize: MediaSize,
  centerPosition: PixelPosition = { x: 0, y: 0 }
) => {
  const leftTopPosition = leftTopIze(centerPosition, magnifiedSize)
  const result: number[] = []
  for (let y = leftTopPosition.y; y < leftTopPosition.y + magnifiedSize.height; y += skip) {
    for (let x = leftTopPosition.x; x < leftTopPosition.x + magnifiedSize.width; x += skip) {
      const i = y * mediaSize.width + x
      const pos = i * 4 // 4 items in each pixel
      const r = pixels[pos]
      const g = pixels[pos + 1]
      const b = pixels[pos + 2]
      const a = pixels[pos + 3]
      result.push(r, g, b, a)
    }
  }
  return result
}
