import { randomIntInclusiveBetween } from 'utils'
import { createMagnifiedSizeList } from './magnify'
import { partialParse } from './pixels'
import { centerPosition, getRestrainedRegion, restrain } from './position'
import { MediaSize, PixelPosition, p5VideoElement } from './types'

export const parseVideo = (
  video: p5VideoElement,
  { size, skip, position }: ReturnType<typeof makeParseOptionSelector>['currentOptions']
) => {
  video.loadPixels()
  return partialParse(video.pixels, video, skip, size, position)
}

export const makeParseOptionSelector = (
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
