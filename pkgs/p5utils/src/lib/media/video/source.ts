import { delay } from 'utils'
import { VideoSourceList, p5VideoElement } from './types'

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

export const waitForVideosToLoad = async (videoElements: p5VideoElement[]) => {
  let check = 0
  while (check < 100) {
    check++
    if (videoElements.every((v) => v.width !== 300)) {
      return true
    } else {
      await delay(20)
    }
  }
  throw Error(`videos couldn't be loaded within 10 secs`)
}
