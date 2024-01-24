import { makeRandomItemPicker as makeRandomArrayPicker, randomIntBetween } from 'utils'
import { centerPosition, restrain, restrainedRegion } from './magnify'
import { magnifyCandidates, partialParse } from './pixels'
import { loadVideoSourceList, waitForVideosToLoad } from './source'
import {
  MediaSize,
  PixelPosition,
  SupplyVideoOption,
  VideoSourceList,
  p5VideoElement
} from './types'

export const makeVideoSupply = (
  sourceList: VideoSourceList,
  options: SupplyVideoOption = { speed: 0.1 },
  onLoad?: (videoElements: p5VideoElement[]) => void,
  playAudio?: () => void
) => {
  const videoElements = loadVideoSourceList(sourceList)
  let loaded = false
  waitForVideosToLoad(videoElements).then(() => {
    loaded = true
    if (onLoad) {
      onLoad(videoElements)
    }
  })

  const randomVideo = makeRandomArrayPicker(videoElements)

  let video: p5VideoElement
  const assignVideo = () => {
    video = randomVideo()
    video.speed(options.speed)
    video.play()
    video.onended(() => {
      video.pause()
      assignVideo()
    })
  }

  const updateOptions = (newOptions: SupplyVideoOption) => {
    if (newOptions.speed) {
      video.speed(newOptions.speed)
    }
    options = { ...options, ...newOptions }
  }

  return {
    isLoaded: () => loaded,
    updateOptions,
    supply: () => {
      if (!video) {
        assignVideo()
      }
      playAudio && playAudio()
      return video
    },
    renew: () => {
      if (video) {
        video.stop()
      }
      assignVideo()
      playAudio && playAudio()
      return video
    },
  }
}

export const makeParseOptionSelector = (
  originalVideoSize: MediaSize,
  finalResolutionWidth: number
) => {
  const magCandidates = magnifyCandidates(originalVideoSize, finalResolutionWidth)
  const sizeCandidates = magCandidates.map((mag) => ({
    width: originalVideoSize.width / mag,
    height: originalVideoSize.height / mag,
  }))
  const restrained = sizeCandidates.map((magSize) => restrainedRegion(originalVideoSize, magSize))

  let position = { x: originalVideoSize.width / 2, y: originalVideoSize.height / 2 }
  let magnifyLevel = 1

  const getSize = () => sizeCandidates[magnifyLevel - 1]
  const getSkip = () => getSize().width / finalResolutionWidth
  const getPosition = () => position
  const getRestrained = () => restrained[magnifyLevel - 1]

  const getOptions = () => {
    return {
      position: getPosition(),
      size: getSize(),
      skip: getSkip(),
    }
  }

  const getCurrentPosition = () => {
    position =
      magnifyLevel !== 1
        ? restrain(getRestrained(), getPosition())
        : centerPosition(originalVideoSize)
    return position
  }

  const changePosition = (change: (position: PixelPosition) => PixelPosition) => {
    const newPosition = change(getPosition())
    position = restrain(getRestrained(), newPosition)
  }

  return {
    get: getOptions,
    randomMagnify: () => {
      magnifyLevel = randomIntBetween(1, magCandidates.length)
    },
    getCurrentPosition,
    changePosition,
  }
}

export const parseVideo = (
  video: p5VideoElement,
  { size, skip, position }: ReturnType<ReturnType<typeof makeParseOptionSelector>['get']>
) => {
  video.loadPixels()
  return partialParse(video.pixels, video, skip, size, position)
}

export const calcPixelSize = (
  { width, height }: MediaSize,
  skip: number,
  canvasWidth: number,
  canvasHeight: number
) => ({
  pxw: canvasWidth / Math.ceil(width / skip),
  pxh: canvasHeight / Math.ceil(height / skip),
})
