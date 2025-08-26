import { makeRandomItemPicker as makeRandomArrayPicker } from 'utils'

export interface SupplyVideoOption {
  speed: number
}

export type VideoSupply = ReturnType<typeof makeVideoSupply>

export const makeVideoSupply = (
  videoElements: HTMLVideoElement[],
  options: SupplyVideoOption = { speed: 0.1 }
) => {
  let currentVideo: HTMLVideoElement
  const randomVideo = makeRandomArrayPicker(videoElements)

  const updateOptions = (newOptions: SupplyVideoOption) => {
    options = { ...options, ...newOptions }
  }

  const swapVideo = () => {
    if (currentVideo) {
      currentVideo.pause()
    }
    currentVideo = randomVideo()

    currentVideo.playbackRate = options.speed
    currentVideo.play()
    currentVideo.onended = endHandler
    swapHandler && swapHandler(currentVideo)
  }

  let swapHandler: (video: HTMLVideoElement) => void
  const onSwap = (cb: typeof swapHandler) => {
    swapHandler = cb
  }

  let endHandler: () => void
  const onEnded = (cb: typeof endHandler) => {
    endHandler = cb
  }

  return {
    get currentVideo() {
      if (!currentVideo) {
        swapVideo()
      }
      return currentVideo
    },
    updateOptions,
    swapVideo,
    onSwap,
    onEnded,
  }
}
