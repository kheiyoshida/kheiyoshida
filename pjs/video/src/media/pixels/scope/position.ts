import { ImageResolution, PixelPosition } from '../types'

/**
 * determine the region where the center position of magnified region can move
 */
export const getRestrainedRegion = (videoSize: ImageResolution, magnifiedSize: ImageResolution) => {
  return {
    t: magnifiedSize.height / 2,
    b: videoSize.height - magnifiedSize.height / 2,
    l: magnifiedSize.width / 2,
    r: videoSize.width - magnifiedSize.width / 2,
  }
}

export const restrain = (
  restrainRegion: ReturnType<typeof getRestrainedRegion>,
  position: PixelPosition
) => {
  if (position.x > restrainRegion.r) {
    position.x = restrainRegion.r
  } else if (position.x < restrainRegion.l) {
    position.x = restrainRegion.l
  }
  if (position.y > restrainRegion.b) {
    position.y = restrainRegion.b
  } else if (position.y < restrainRegion.t) {
    position.y = restrainRegion.t
  }
  return position
}

export const centerPosition = (size: ImageResolution) => ({
  x: size.width / 2,
  y: size.height / 2,
})

/**
 * convert center position to left-top position
 * @param position
 * @param magnifiedSize
 * @returns
 */
export const leftTopIze = (position: PixelPosition, magnifiedSize: ImageResolution) => {
  const [halfWidth, halfHeight] = [magnifiedSize.width / 2, magnifiedSize.height / 2]
  // if (!Number.isInteger(halfWidth) || !Number.isInteger(halfHeight)) {
  //   throw Error(`magnifiedSize is not consisting of even numbers: ${JSON.stringify(magnifiedSize)}`)
  // }
  return {
    x: position.x - Math.floor(halfWidth),
    y: position.y - Math.floor(halfHeight),
  }
}
