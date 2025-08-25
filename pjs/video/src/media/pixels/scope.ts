import { MediaSize, MovableRegion, PixelPosition } from './types'
import { createMagnifiedSizeList } from './magnify'
import { centerPosition, getRestrainedRegion, restrain } from './position'
import { randomIntInclusiveBetween } from 'utils'

export class ImageScope {
  // possible image resolution sizes it can take
  private readonly sizeCandidates: MediaSize[]

  // the regions position can take in magnified images
  // so that it won't show pixels outside image
  private readonly movableRegionsBySize: MovableRegion[]

  public readonly finalResolution: MediaSize
  public readonly finalPixelDataSize: number

  constructor(
    public readonly originalImageSize: MediaSize,
    private finalResolutionWidth: number
  ) {
    this.sizeCandidates = createMagnifiedSizeList(originalImageSize, finalResolutionWidth)
    console.log(this.sizeCandidates)
    this.movableRegionsBySize = this.sizeCandidates.map((size) =>
      getRestrainedRegion(originalImageSize, size)
    )
    this.position = centerPosition(originalImageSize)

    const finalResolutionHeight = finalResolutionWidth * (originalImageSize.height / originalImageSize.width)
    this.finalResolution = {
      width: finalResolutionWidth,
      height: finalResolutionHeight
    }
    this.finalPixelDataSize = finalResolutionWidth * finalResolutionHeight * 4
  }

  public position: PixelPosition
  private resetPosition() {
    this.position = centerPosition(this.originalImageSize)
  }

  private magnifyLevel = 0

  get size() {
    return this.sizeCandidates[this.magnifyLevel]
  }

  get region() {
    return this.movableRegionsBySize[this.magnifyLevel]
  }

  /**
   * the number of pixels parser should skip while preserving the final resolution width
   */
  get skip() {
    return this.size.width / this.finalResolutionWidth
  }

  get params() {
    return {
      position: this.position,
      size: this.size,
      skip: this.skip,
    }
  }

  randomMagnify(limit = this.sizeCandidates.length - 1) {
    if (limit > this.sizeCandidates.length - 1) throw new RangeError()
    this.magnifyLevel = randomIntInclusiveBetween(0, limit)
    if (this.magnifyLevel === 0) {
      this.resetPosition()
    }
    console.log(this.magnifyLevel)
  }

  changePosition(change: (position: PixelPosition) => PixelPosition) {
    if (this.magnifyLevel === 0) return
    const newPosition = change(this.position)
    this.position = restrain(this.region, newPosition)
  }

  get magnifyLevels() {
    return this.sizeCandidates
  }
}
