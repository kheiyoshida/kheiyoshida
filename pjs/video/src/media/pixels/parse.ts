import { ImageScope } from './scope/scope'
import { MediaSize, PixelPosition } from './types'
import { leftTopIze } from './scope/position'

export class PixelParser {
  public readonly scope: ImageScope

  constructor(scope: ImageScope) {
    this.scope = scope
    this.parseResult = new Uint8Array(
      this.scope.finalResolution.width * this.scope.finalResolution.height * 4
    )
  }

  public readonly parseResult: Uint8Array

  public parsePixelData(pixels: Uint8Array): Uint8Array {
    const { pixelSkip, scopedSize, scopeCenter } = this.scope.parseParams
    const leftTopPosition = leftTopIze(scopeCenter, scopedSize)
    let r = 0
    for (let y = leftTopPosition.y; y < leftTopPosition.y + scopedSize.height; y += pixelSkip) {
      for (let x = leftTopPosition.x; x < leftTopPosition.x + scopedSize.width; x += pixelSkip) {
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
