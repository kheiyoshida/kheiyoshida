import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'
import { getGL } from './gl/gl'
import { Texture } from './gl/texture'
import { DotInstance } from './gl/model/dot'
import { OffScreenTextureRenderer } from './gl/renderers/offscreen'
import { ScreenRenderer } from './gl/renderers/renderer'
import { PixelParser } from './media/pixels/parse'
import { randomFloatBetween, randomIntInclusiveBetween } from 'utils'
import { ImageScope } from './media/pixels/scope/scope'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.3 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

getGL()

const videoTexture = new Texture()
const frameBufferWidth = 640
const frameBufferHeight = frameBufferWidth / (16 / 9)
const offscreenTextureRenderer = new OffScreenTextureRenderer(
  videoTexture,
  frameBufferWidth,
  frameBufferHeight
)

const screenRenderer = new ScreenRenderer()
screenRenderer.backgroundColor = [0, 0, 0, 1]
const dotInstance = new DotInstance(3.6)

const scope = new ImageScope(
  {
    width: frameBufferWidth,
    height: frameBufferHeight,
  },
  160
)
const parser = new PixelParser(scope)
const { width: resolutionWidth, height: resolutionHeight } = scope.finalResolution

function renderVideo() {
  requestAnimationFrame(renderVideo)

  if (!videoSupply) return
  if (videoSupply.currentVideo.readyState < HTMLVideoElement.prototype.HAVE_CURRENT_DATA) return

  if (Math.random() < 0.03) {
    videoSupply.swapVideo()
    scope.magnifyLevel = randomIntInclusiveBetween(0, scope.maxMagnifyLevel)
    scope.position = {
      x: scope.position.x + randomIntInclusiveBetween(-100, 100),
      y: scope.position.y + randomIntInclusiveBetween(-100, 100),
    }
  }

  videoTexture.setTextureImage(videoSupply.currentVideo)
  const rawPixels = offscreenTextureRenderer.renderAsPixels()
  const parsedPixels = parser.parsePixelData(rawPixels)

  const instanceData = []
  for (let y = 0; y < resolutionHeight; y += 1) {
    for (let x = 0; x < resolutionWidth; x += 1) {
      const i = (y * resolutionWidth + x) * 4
      if (parsedPixels[i + 2] > 40) {

        const dx = 0//randomIntInclusiveBetween(-2, 2)
        const dy = 0//randomIntInclusiveBetween(-2, 2)
        instanceData.push((x + dx) / resolutionWidth, (y + dy) / resolutionHeight) // normalized, flipped Y

        // instanceData.push(parsedPixels[i] / 255, parsedPixels[i + 1] / 255, parsedPixels[i + 2] / 255)
        const bri = parsedPixels[i + 2] / 255
        instanceData.push(bri, bri, bri)

        instanceData.push(randomFloatBetween(0.05, 0.2) / resolutionHeight) // size
        // instanceData.push(0.5 / resolutionHeight) // size
      }
    }
  }

  dotInstance.setInstances(instanceData)
  dotInstance.setSize(0.1 / resolutionHeight)
  screenRenderer.render([dotInstance])
}
renderVideo()
