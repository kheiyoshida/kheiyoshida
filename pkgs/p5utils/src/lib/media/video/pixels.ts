import { getCommonDivisors, getFloatDivisors } from 'utils'
import { RGBA, RGBAMatrix } from '../../data/matrix/types'
import { leftTopIze } from './magnify'
import { MediaSize, PixelPosition } from './types'

export const magnifyCandidates = (videoSize: MediaSize, resolution: number, bindHeight = false) => {
  try {
    const candidates = getFloatDivisors(videoSize.width / resolution)
    if (!bindHeight) return candidates
    return candidates.filter((m) => videoSize.height % m === 0)
  } catch (e) {
    throw new WrongResolutionError(videoSize, resolution)
  }
}

class WrongResolutionError extends Error {
  constructor(videoSize: MediaSize, resolution: number) {
    super(`maybe setting wrong candidate for resolution. ${resolution}
    the candidates would be: ${JSON.stringify(resolutionCandidates(videoSize), null, 4)}`)
  }
}

const resolutionCandidates = (size: MediaSize) =>
  Object.fromEntries(
    getCommonDivisors(size.width, size.height).map((d) => [
      d,
      { width: size.width / d, height: size.height / d },
    ])
  ) as { [skip: number]: MediaSize }

/**
 * Parse media pixels and make RGBA matrix
 *
 * @param pixels pixel array of image/video
 * @param skip number of pixels it should skip during the parse
 * @param magnifiedSize actual size compared to the original media size. i.e. magnified
 * @param position top left position of the magnified frame on the original media
 * @returns
 */
export const partialParse = (
  pixels: number[] | Uint8ClampedArray,
  videoSize: MediaSize,
  skip: number,
  magnifiedSize: MediaSize,
  centerPosition: PixelPosition = { x: 0, y: 0 }
) => {
  const leftTopPosition = leftTopIze(centerPosition, magnifiedSize)
  const matrix: RGBAMatrix = []
  validatePosition(leftTopPosition, magnifiedSize, videoSize)
  for (let y = leftTopPosition.y; y < leftTopPosition.y + magnifiedSize.height; y += skip) {
    const row: RGBA[] = []
    for (let x = leftTopPosition.x; x < leftTopPosition.x + magnifiedSize.width; x += skip) {
      const i = y * videoSize.width + x
      const pos = i * 4 // 4 items in each pixel
      const r = pixels[pos]
      const g = pixels[pos + 1]
      const b = pixels[pos + 2]
      const a = pixels[pos + 3]
      row.push([r, g, b, a])
    }
    matrix.push(row)
  }
  return matrix
}

export const validatePosition = (
  position: PixelPosition,
  magnifiedSize: MediaSize,
  videoSize: MediaSize
) => {
  if (
    position.y < 0 ||
    position.x < 0 ||
    position.y + magnifiedSize.height > videoSize.height ||
    position.x + magnifiedSize.width > videoSize.width
  ) {
    console.error({ ...position, ...magnifiedSize })
    throw Error()
  }
}
