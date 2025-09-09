import { getCommonDivisors, getFloatDivisors } from 'utils'
import { ImageResolution } from '../types'

export const createMagnifiedSizeList = (
  originalMediaSize: ImageResolution,
  finalResolutionWidth: number,
  bindHeight = false
): ImageResolution[] => {
  const magCandidates = listMagnifyCandidates(originalMediaSize, finalResolutionWidth, bindHeight)
  return magCandidates.map((mag) => ({
    width: originalMediaSize.width / mag,
    height: originalMediaSize.height / mag,
  }))
}

export const listMagnifyCandidates = (videoSize: ImageResolution, resolution: number, bindHeight = false) => {
  try {
    const candidates = getFloatDivisors(videoSize.width / resolution)
    if (!bindHeight) return candidates
    return candidates.filter((m) => videoSize.height % m === 0)
  } catch (e) {
    console.error(e)
    throw new WrongResolutionError(videoSize, resolution)
  }
}

export class WrongResolutionError extends Error {
  constructor(videoSize: ImageResolution, resolution: number) {
    super(`maybe setting wrong candidate for resolution. ${resolution}
    the candidates would be: ${JSON.stringify(resolutionCandidates(videoSize), null, 4)}`)
  }
}

const resolutionCandidates = (size: ImageResolution) =>
  Object.fromEntries(
    getCommonDivisors(size.width, size.height).map((d) => [
      d,
      { width: size.width / d, height: size.height / d },
    ])
  ) as { [skip: number]: ImageResolution }
