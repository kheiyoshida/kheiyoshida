import { VideoPixelChannel } from '../../lib/channel/channel'
import { VideoSupply } from '../../media/video/supply'
import { fireByRate, makeIntWobbler, randomIntInclusiveBetween, randomItemFromArray } from 'utils'
import { videoSourceList } from './videos'

export class ShinjukuChannel extends VideoPixelChannel {
  constructor(videoAspectRatio: number, videoWidth: number, outputResolutionWidth: number) {
    super(new VideoSupply(videoSourceList), videoAspectRatio, videoWidth, outputResolutionWidth)
  }

  public async waitForReady(onProgress: (progress: number) => void) {
    const interval = setInterval(() => {
      onProgress(this.source.loadingProgress)
    }, 100)
    await this.source.readyPromise
    clearTimeout(interval)
  }

  // use cases
  private wobble = makeIntWobbler(10)
  public update() {
    if (fireByRate(0.05)) {
      this.source.swapVideo()
    }
    if (fireByRate(0.4)) {
      this.source.updateOptions({
        speed: randomItemFromArray([0.1, 0.3, 0.5]),
      })
    }
    if (fireByRate(0.1)) {
      this.scope.magnifyLevel = randomIntInclusiveBetween(0, this.scope.maxMagnifyLevel)
    }
    if (fireByRate(0.3)) {
      this.scope.position = {
        x: this.wobble(this.scope.position.x),
        y: this.wobble(this.scope.position.y),
      }
    }
  }

  public interact(e: PointerEvent) {
    const offsetX = e.x - window.innerWidth / 2
    const offsetY = e.y - window.innerHeight / 2
    if (this.scope.magnifyLevel == this.scope.maxMagnifyLevel) {
      this.source.swapVideo()
      this.scope.magnifyLevel = 0
    } else {
      this.scope.magnifyLevel++
      this.scope.position = {
        x: this.scope.position.x + Math.floor(10 * (offsetX / window.innerWidth)),
        y: this.scope.position.y + Math.floor(10 * (offsetY / window.innerHeight)),
      }
    }
  }
}
