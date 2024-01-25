import { randomIntInclusiveBetween } from 'utils'
import { createMagnifiedSizeList } from './magnify'
import { centerPosition, getRestrainedRegion, restrain } from './position'
import { MediaSize, PixelPosition } from './types'

export type PixelParseOptionSelector = ReturnType<typeof makePixelParseOptionSelector>

export const makePixelParseOptionSelector = (
  originalVideoSize: MediaSize,
  finalResolutionWidth: number
) => {
  const sizeCandidates = createMagnifiedSizeList(originalVideoSize, finalResolutionWidth)
  const movableRegionsBySize = sizeCandidates.map((size) =>
    getRestrainedRegion(originalVideoSize, size)
  )

  let position = centerPosition(originalVideoSize)
  let magnifyLevel = 0

  const resetPosition = () => {
    position = centerPosition(originalVideoSize)
  }

  const getSize = () => sizeCandidates[magnifyLevel]
  const getRegion = () => movableRegionsBySize[magnifyLevel]
  const getSkip = () => getSize().width / finalResolutionWidth

  return {
    get currentOptions() {
      return {
        position,
        size: getSize(),
        skip: getSkip(),
      }
    },
    randomMagnify: () => {
      magnifyLevel = randomIntInclusiveBetween(0, sizeCandidates.length - 1)
      if (magnifyLevel === 0) {
        resetPosition()
      }
    },
    changePosition: (change: (position: PixelPosition) => PixelPosition) => {
      if (magnifyLevel === 0) return
      const newPosition = change(position)
      position = restrain(getRegion(), newPosition)
    },
  }
}
