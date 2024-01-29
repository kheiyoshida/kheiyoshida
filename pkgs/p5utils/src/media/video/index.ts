import { convertPixelDataIntoMatrix } from '../pixel/pixels'
import { p5VideoElement } from './types'
import { makePixelParseOptionSelector } from '../pixel/options'

export const parseVideo = (
  video: p5VideoElement,
  { size, skip, position }: ReturnType<typeof makePixelParseOptionSelector>['currentOptions']
) => {
  video.loadPixels()
  return convertPixelDataIntoMatrix(video.pixels, video, skip, size, position)
}

export { prepareVideoElements } from './source'
export { makeVideoSupply } from './supply'
export type { VideoSupply } from './supply'
