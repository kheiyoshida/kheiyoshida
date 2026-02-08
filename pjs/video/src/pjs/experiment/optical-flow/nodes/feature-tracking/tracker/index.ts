type Feature = {
  x: number
  y: number
  strength: number
}

export type TrackedFeature = {
  x0: number
  y0: number
  x1: number
  y1: number
  strength: number
  error: number
}

export class FeatureTracker {
  private greyPassWidth!: number
  private greyPassHeight!: number
  private featurePassWidth!: number
  private featurePassHeight!: number
  private featurePassTileSize!: number

  public setGreyscalePassDimension(width: number, height: number) {
    this.greyPassWidth = width
    this.greyPassHeight = height
  }

  public setFeatureDetectionPassDimension(width: number, height: number) {
    if (!Number.isInteger(width) || !Number.isInteger(height)) {
      console.warn(`invalid feature detection pass dimension: ${width}, ${height}`)
    }
    this.featurePassWidth = Math.floor(width)
    this.featurePassHeight = Math.floor(height)
  }

  public setTileSize(tileSize: number) {
    this.featurePassTileSize = tileSize
  }

  private prevGrey?: Uint8Array
  private prevFeatures?: Feature[]

  public track(greyScaleData: Uint8Array, featureData: Uint8Array): TrackedFeature[] {
    const currGrey = greyScaleData
    const currFeatures = this.decodeFeatures(featureData)

    if (!this.prevGrey || !this.prevFeatures) {
      this.prevGrey = currGrey
      this.prevFeatures = currFeatures
      return []
    }

    const trackedFeatures: TrackedFeature[] = []

    const PATCH_RADIUS = 2
    const SEARCH_RADIUS = 6
    const MAX_ERROR = 0.01

    const BORDER = PATCH_RADIUS + SEARCH_RADIUS

    for (const prevFeature of this.prevFeatures) {
      if (prevFeature.strength < 0.4) continue
      let bestError = Infinity
      let bestSearchX = 0
      let bestSearchY = 0

      // search
      for (let sy = -SEARCH_RADIUS; sy <= SEARCH_RADIUS; sy++) {
        for (let sx = -SEARCH_RADIUS; sx <= SEARCH_RADIUS; sx++) {
          const x1 = prevFeature.x + sx
          const y1 = prevFeature.y + sy

          if (sx === 0 && sy === 0) continue
          // if (sx * sx + sy * sy < 1) continue // 1 pixel square

          if (
            x1 < BORDER ||
            y1 < BORDER ||
            x1 >= this.greyPassWidth - BORDER ||
            y1 >= this.greyPassHeight - BORDER
          ) {
            continue
          }

          const err = this.patchError(
            this.prevGrey,
            currGrey,
            prevFeature.x,
            prevFeature.y,
            x1,
            y1,
            PATCH_RADIUS
          )

          if (err < bestError) {
            bestError = err
            bestSearchX = sx
            bestSearchY = sy
          }
        }
      }

      if (bestError < MAX_ERROR) {
        trackedFeatures.push({
          x0: prevFeature.x,
          y0: prevFeature.y,
          x1: prevFeature.x + bestSearchX,
          y1: prevFeature.y + bestSearchY,
          strength: prevFeature.strength,
          error: bestError,
        })
      }
    }

    this.prevGrey = currGrey
    this.prevFeatures = currFeatures

    return trackedFeatures
  }

  private decodeFeatures(featureData: Uint8Array) {
    const features: Feature[] = []

    for (let tileY = 0; tileY < this.featurePassHeight; tileY++) {
      for (let tileX = 0; tileX < this.featurePassWidth; tileX++) {
        const i = (tileY * this.featurePassWidth + tileX) * 4

        if (featureData[i + 3] === 0) continue

        const strength = featureData[i] / 255
        const offsetX = featureData[i + 1] / 255
        const offsetY = featureData[i + 2] / 255

        // TODO: examine this decode
        const x = tileX * this.featurePassTileSize + offsetX * this.featurePassTileSize
        const y = tileY * this.featurePassTileSize + offsetY * this.featurePassTileSize

        features.push({ x, y, strength })
      }
    }

    return features
  }

  private patchError(
    grayPrev: Uint8Array,
    grayCurr: Uint8Array,
    prevFeatureX: number,
    prevFeatureY: number,
    searchX: number,
    searchY: number,
    radius: number
  ): number {
    let error = 0

    // collect ssd within patch range
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const p = this.grayAt(grayPrev, prevFeatureX + dx, prevFeatureY + dy)
        const s = this.grayAt(grayCurr, searchX + dx, searchY + dy)
        const d = p - s
        error += d * d
      }
    }

    return error
  }

  private grayAt(gray: Uint8Array, x: number, y: number): number {
    const ix = Math.floor(x)
    const iy = Math.floor(y)

    if (ix < 0 || iy < 0 || ix >= this.greyPassWidth || iy >= this.greyPassHeight) {
      return 0
    }

    const index = (iy * this.greyPassWidth + ix) * 4
    return gray[index + 3] / 255 // alpha channel
  }
}
