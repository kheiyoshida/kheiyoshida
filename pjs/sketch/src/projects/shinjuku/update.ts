import { PixelParseOptionSelector } from 'p5utils/src/lib/media/pixel/options'
import { VideoSupply } from 'p5utils/src/lib/media/video/supply'
import { makeIntWobbler, fireByRate as random, randomItemFromArray } from 'utils'

const wobble = makeIntWobbler(5)

export const updateVideoOptions = (
  videoSupply: VideoSupply,
  parseOptions: PixelParseOptionSelector
) => {
  if (random(0.1)) {
    videoSupply.swapVideo()
  }
  if (random(0.1)) {
    parseOptions.randomMagnify()
  }
  if (random(0.6)) {
    parseOptions.changePosition((position) => ({
      x: wobble(position.x),
      y: wobble(position.y),
    }))
  }
  if (random(0.4)) {
    videoSupply.updateOptions({
      speed: randomItemFromArray([0.2, 0.3, 0.5]),
    })
  }
}
