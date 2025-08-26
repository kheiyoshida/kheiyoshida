import { ImageScope } from '../../media/pixels/scope/scope'
import { fireByRate, makeIntWobbler, randomIntInclusiveBetween, randomItemFromArray } from 'utils'
import { VideoSupply } from '../../media/video/supply'

export const updateVideo = (videoSupply: VideoSupply) => {
  if (fireByRate(0.05)) {
    videoSupply.swapVideo()
  }
  if (fireByRate(0.4)) {
    videoSupply.updateOptions({
      speed: randomItemFromArray([0.1, 0.3, 0.5]),
    })
  }
}

const wobble = makeIntWobbler(10)
export const updateScope = (scope: ImageScope) => {
  if (fireByRate(0.1)) {
    scope.magnifyLevel = randomIntInclusiveBetween(0, scope.maxMagnifyLevel)
  }
  if (fireByRate(0.3)) {
    scope.position = {
      x: wobble(scope.position.x),
      y: wobble(scope.position.y),
    }
  }
}
