import { MediaSize, MovableRegion, PixelPosition } from '../types'
import { createMagnifiedSizeList } from './magnify'
import { centerPosition, getRestrainedRegion, restrain } from './position'

export class ImageScope {
  // possible image resolution sizes it can take
  private readonly scopedSizes: MediaSize[]

  // the regions position can take in magnified images
  // so that it won't show pixels outside image
  private readonly movableRegionsBySize: MovableRegion[]

  // the parse option should be provided so that
  // final parsed size meets this resolution however the magnifyLevel and position is
  public readonly finalResolution: MediaSize

  constructor(
    public readonly originalImageSize: MediaSize,
    finalResolutionWidth: number
  ) {
    const finalResolutionHeight = finalResolutionWidth * (originalImageSize.height / originalImageSize.width)
    this.finalResolution = {
      width: finalResolutionWidth,
      height: finalResolutionHeight,
    }

    this.scopedSizes = createMagnifiedSizeList(originalImageSize, finalResolutionWidth)
    this.movableRegionsBySize = this.scopedSizes.map((size) => getRestrainedRegion(originalImageSize, size))

    this._position = centerPosition(originalImageSize)
  }

  private get movablePosition() {
    return this.movableRegionsBySize[this._magnifyLevel]
  }

  private _position: PixelPosition
  public get position(): PixelPosition {
    return this._position
  }
  public set position(position: PixelPosition) {
    if (this._magnifyLevel === 0) {
      this.resetPosition()
    } else {
      this._position = restrain(this.movablePosition, position)
    }
  }
  private resetPosition() {
    this._position = centerPosition(this.originalImageSize)
  }

  private _magnifyLevel = 0
  public get magnifyLevel() {
    return this._magnifyLevel
  }
  public set magnifyLevel(level: number) {
    if (level > this.scopedSizes.length - 1) throw new RangeError()
    this._magnifyLevel = level
    if (this._magnifyLevel === 0) {
      this.resetPosition()
    } else {
      this._position = restrain(this.movablePosition, this._position)
    }
  }
  public get maxMagnifyLevel() {
    return this.scopedSizes.length - 1
  }

  private get scopedSize() {
    return this.scopedSizes[this._magnifyLevel]
  }

  /**
   * the number of pixels parser should skip while preserving the final resolution width
   */
  private get skip() {
    return this.scopedSize.width / this.finalResolution.width
  }

  public get parseParams() {
    return {
      scopeCenter: this.position,
      scopedSize: this.scopedSize,
      pixelSkip: this.skip,
    }
  }
}
