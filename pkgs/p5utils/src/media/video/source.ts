import { delay } from 'utils'
import { VideoSourceList, p5VideoElement } from './types'

export const prepareVideoElements = async (
  sourceList: VideoSourceList
): Promise<p5VideoElement[]> => {
  const videoElements = loadVideoSourceList(sourceList)
  await waitForVideosToLoad(videoElements)
  return videoElements
}

export const loadVideoSourceList = (sourceList: VideoSourceList): p5VideoElement[] => {
  const videoElements = sourceList.map((s) => p.createVideo(s) as p5VideoElement)
  videoElements.forEach((video) => {
    video.attribute('playsinline', 'true')
    video.hideControls()
    video.volume(0)
    video.hide()
  })
  return videoElements
}

export const waitForVideosToLoad = async (
  videoElements: p5VideoElement[],
  waitSeconds = 10,
  checkEveryMs = 20
) => {
  let check = 0
  while (check < (waitSeconds * 1000) / checkEveryMs) {
    check++
    if (videoElements.every((v) => v.width !== 300)) {
      return true
    } else {
      await delay(checkEveryMs)
    }
  }
  throw Error(`videos couldn't be loaded within ${waitSeconds} secs`)
}
