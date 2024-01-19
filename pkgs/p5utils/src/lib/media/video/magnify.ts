import { MediaSize, PixelPosition } from './types'

/**
 * determine the region where the center position of magnified region can move
 */
export const restrainedRegion = (videoSize: MediaSize, magnifiedSize: MediaSize) => {
  return {
    t: magnifiedSize.height / 2,
    b: videoSize.height - magnifiedSize.height / 2,
    l: magnifiedSize.width / 2,
    r: videoSize.width - magnifiedSize.width / 2,
  }
}

export const restrain = (
  restrainRegion: ReturnType<typeof restrainedRegion>,
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

export const centerPosition = (size: MediaSize) => ({
  x: size.width / 2,
  y: size.height / 2,
})

/**
 * convert center position to left-top position
 * @param position
 * @param magnifiedSize
 * @returns
 */
export const leftTopIze = (position: PixelPosition, magnifiedSize: MediaSize) => {
  const [halfWidth, halfHeight] = [magnifiedSize.width / 2, magnifiedSize.height / 2]
  if (Number.isInteger(halfWidth) && Number.isInteger(halfHeight))
    return {
      x: position.x - magnifiedSize.width / 2,
      y: position.y - magnifiedSize.height / 2,
    }
  throw Error(`magnifiedSize is not consisting of even numbers`)
}
