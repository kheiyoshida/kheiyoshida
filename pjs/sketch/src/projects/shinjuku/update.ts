import { PixelParseOptionSelector } from 'p5utils/src/lib/media/pixel/options'
import { VideoSupply } from 'p5utils/src/lib/media/video/supply'
import { makeIntWobbler, fireByRate as random, randomItemFromArray } from 'utils'
import { ch, cw } from '.'

const wobble10 = makeIntWobbler(10)
const superWobble = makeIntWobbler(Math.min(ch, cw) / 4)

export const updateVideoOptions = (
  videoSupply: VideoSupply,
  parseOptions: PixelParseOptionSelector
) => {
  // change video options
  if (random(0.02)) {
    videoSupply.swapVideo()
  }
  if (random(0.2)) {
    // parseOptions.changePosition((position) => ({
    //   x: superWobble(position.x),
    //   y: superWobble(position.y),
    // }))
    parseOptions.randomMagnify(2)
    videoSupply.updateOptions({
      speed: randomItemFromArray([0.1, 0.3, 0.5]),
    })
  }
  parseOptions.changePosition((position) => ({
    x: wobble10(position.x),
    y: wobble10(position.y),
  }))
}
