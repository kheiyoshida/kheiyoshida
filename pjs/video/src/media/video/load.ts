export const prepareVideoElements = async (sourceList: string[]): Promise<HTMLVideoElement[]> => {
  const videoElements = loadVideoSourceList(sourceList)
  await waitForVideosToLoad(videoElements)
  return videoElements
}

export const loadVideoSourceList = (sourceList: string[]): HTMLVideoElement[] => {
  return sourceList.map((src) => {
    const video = document.createElement('video')
    // IMPORTANT: set crossOrigin before assigning src
    video.crossOrigin = 'anonymous'
    video.playsInline = true
    video.muted = true
    video.preload = 'auto'
    video.src = src
    // Do not set the boolean `controls` attribute unless you want visible controls
    return video
  })
}

type VideoReadyEvent = 'loadedmetadata' | 'loadeddata' | 'canplay' | 'canplaythrough'

export const waitForVideosToLoad = async (
  videoElements: HTMLVideoElement[],
  waitSeconds = 10,
  event: VideoReadyEvent = 'canplay'
) => {
  const timeoutMs = waitSeconds * 1000
  await Promise.all(videoElements.map((v) => waitForVideoReady(v, event, timeoutMs)))
  return true
}

const waitForVideoReady = (
  video: HTMLVideoElement,
  event: VideoReadyEvent = 'canplay',
  timeoutMs = 10_000
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const isReady = (v: HTMLVideoElement) => {
      switch (event) {
        case 'loadedmetadata':
          return v.readyState >= HTMLMediaElement.HAVE_METADATA
        case 'loadeddata':
          return v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
        case 'canplay':
          return v.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA
        case 'canplaythrough':
          return v.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA
      }
    }

    if (isReady(video)) return resolve()

    const onReady = () => cleanup(resolve)
    const onError = () => cleanup(() => reject(new Error('Video failed to load')))
    const onTimeout = () => cleanup(() => reject(new Error(`Timed out after ${timeoutMs}ms`)))

    const cleanup = (done: () => void) => {
      clearTimeout(timer)
      video.removeEventListener(event, onReady)
      video.removeEventListener('error', onError)
      done()
    }

    video.addEventListener(event, onReady, { once: true })
    video.addEventListener('error', onError, { once: true })

    const timer = setTimeout(onTimeout, timeoutMs)

    // Ensure loading starts
    try {
      video.load()
    } catch {}
  })
}
