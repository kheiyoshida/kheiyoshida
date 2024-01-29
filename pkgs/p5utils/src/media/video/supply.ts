import { makeRandomItemPicker as makeRandomArrayPicker } from 'utils'
import { SupplyVideoOption, p5VideoElement } from './types'

export type VideoSupply = ReturnType<typeof makeVideoSupply>

export const makeVideoSupply = (
  videoElements: p5VideoElement[],
  options: SupplyVideoOption = { speed: 0.1 }
) => {
  let currentVideo: p5VideoElement
  const randomVideo = makeRandomArrayPicker(videoElements)

  const updateOptions = (newOptions: SupplyVideoOption) => {
    options = { ...options, ...newOptions }
  }

  const swapVideo = () => {
    if (currentVideo) {
      currentVideo.pause()
    }
    currentVideo = randomVideo()
    currentVideo.speed(options.speed)
    currentVideo.play()
    currentVideo.onended(endHandler)
    swapHandler && swapHandler(currentVideo)
  }

  let swapHandler: (video: p5VideoElement) => void
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
