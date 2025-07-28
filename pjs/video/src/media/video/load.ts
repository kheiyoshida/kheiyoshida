import { delay } from 'utils'

export const prepareVideoElements = async (
  sourceList: string[]
): Promise<HTMLVideoElement[]> => {
  const videoElements = loadVideoSourceList(sourceList)
  await waitForVideosToLoad(videoElements)
  return videoElements
}

export const loadVideoSourceList = (sourceList: string[]): HTMLVideoElement[] => {
  const videoElements = sourceList.map((s) => {
    const video = document.createElement('video')
    video.src = s
    video.setAttribute('playsinline', 'true')
    video.setAttribute('controls', 'false')
    video.setAttribute('mute', 'true')
    return video
  })
  return videoElements
}

export const waitForVideosToLoad = async (
  videoElements: HTMLVideoElement[],
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
