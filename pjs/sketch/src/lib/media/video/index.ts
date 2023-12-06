import { once } from '../../utils/fp'
import { makeRandomArrayPicker, randomIntBetween } from "src/lib/utils/random"
import { centerPosition, restrain, restrainedRegion } from './magnify'
import { magnifyCandidates, partialParse } from './pixels'
import {
  MediaSize,
  PixelPosition,
  SupplyVideo,
  SupplyVideoOption,
  VideoSourceList,
  p5VideoElement
} from './types'

const vs = (video: p5VideoElement) => ({
  width: video.width,
  height: video.height,
})

const loadVideoSourceList = (sourceList: VideoSourceList): p5VideoElement[] => {
  const videoElements = sourceList.map(
    (s) => p.createVideo(s) as p5VideoElement
  )
  videoElements.forEach((video) => {
    video.attribute('playsinline', 'true')
    video.hideControls()
    video.volume(0)
    video.hide()
  })
  return videoElements
}

const waitForVideosToLoad = async (videoElements: p5VideoElement[]) => {
  let check = 0
  while (check < 100) {
    check++
    if (videoElements.every((v) => v.width !== 300)) {
      return true
    } else {
      await new Promise((r) => setTimeout(r, 20))
    }
  }
  throw Error(`videos couldn't be loaded within 10 secs`)
}

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
  video: p5VideoElement,
  resolution: number
) => {
  const videoSize = vs(video)
  const magCandidates = magnifyCandidates(videoSize, resolution)
  const sizeCandidates = magCandidates.map((mag) => ({
    width: videoSize.width / mag,
    height: videoSize.height / mag,
  }))
  const restrained = sizeCandidates.map(magSize => restrainedRegion(videoSize, magSize))

  let position = { x: video.width / 2, y: video.height / 2 }
  let magnifyLevel = 1

  const getSize = () => sizeCandidates[magnifyLevel - 1]
  const getSkip = () => getSize().width / resolution
  const getPosition = () => position
  const getRestrained = () => restrained[magnifyLevel - 1]

  const getOptions = () => {
    return {
      position: getPosition(),
      size: getSize(),
      skip: getSkip(),
    }
  }

  const selectMagnify = (mag: number) => {
    if (mag < magCandidates.length) {
      magnifyLevel = mag
    }
    throw Error(
      `range error: available magnify is: ${JSON.stringify(magCandidates)}`
    )
  }

  const getCurrentPosition = () => {
    position = 
      magnifyLevel !== 1
        ? restrain(getRestrained(), getPosition())
        : centerPosition(videoSize)
    return position
  }

  const changePosition = (
    change: (position: PixelPosition) => PixelPosition
  ) => {
    const newPosition = change(getPosition())
    position = restrain(getRestrained(), newPosition)
  }

  return {
    get: getOptions,
    selectMagnify,
    randomMagnify: () => {
      magnifyLevel = randomIntBetween(1, magCandidates.length)
    },
    getCurrentPosition,
    changePosition,
  }
}

export const parseVideo = (
  video: ReturnType<SupplyVideo>,
  {
    size,
    skip,
    position,
  }: ReturnType<ReturnType<typeof makeParseOptionSelector>['get']>
) => {
  const videoSize = vs(video)
  video.loadPixels()
  return partialParse(video.pixels, videoSize, skip, size, position)
}

export const calcPixelSize = once((
  { width, height }: MediaSize,
  skip: number,
  canvasWidth: number,
  canvasHeight: number
) => ({
  pxw: canvasWidth / Math.ceil(width / skip),
  pxh: canvasHeight / Math.ceil(height / skip),
}))