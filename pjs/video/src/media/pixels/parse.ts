import { ImageScope } from './scope/scope'
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
