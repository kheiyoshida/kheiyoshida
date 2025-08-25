import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'
import { getGL } from './gl/gl'
import { Texture } from './gl/texture'
import { DotInstance } from './gl/model/dot'
import { OffScreenTextureRenderer } from './gl/renderers/offscreen'
import { ScreenRenderer } from './gl/renderers/renderer'
import { PixelParser } from './media/pixels/parse'
import { randomIntInclusiveBetween } from 'utils'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.3 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

getGL()

const videoTexture = new Texture()
const frameBufferWidth = 600
const frameBufferHeight = frameBufferWidth / (16/9)
const offscreenTextureRenderer = new OffScreenTextureRenderer(
  videoTexture,
  frameBufferWidth,
  frameBufferHeight
)

const screenRenderer = new ScreenRenderer()
screenRenderer.backgroundColor = [0, 0, 0, 1]
const dotInstance = new DotInstance()

const parser = new PixelParser(
  {
    width: frameBufferWidth,
    height: frameBufferHeight,
  },
  200
)
const { width: resolutionWidth, height: resolutionHeight } = parser.scope.finalResolution

function renderVideo() {
  requestAnimationFrame(renderVideo)

  if (!videoSupply) return
  if (videoSupply.currentVideo.readyState < HTMLVideoElement.prototype.HAVE_CURRENT_DATA) return

  if (Math.random() < 0.03) {
    // videoSupply.swapVideo()
    parser.scope.randomMagnify()
    parser.scope.changePosition((pos) => ({
      x: pos.x + randomIntInclusiveBetween(-100, 100),
      y: pos.y + randomIntInclusiveBetween(-100, 100),
    }))
  }

  videoTexture.setTextureImage(videoSupply.currentVideo)
  const rawPixels = offscreenTextureRenderer.renderAsPixels()
  const parsedPixels = parser.parsePixelData(rawPixels)

  const instances = []
  for (let y = 0; y < resolutionHeight; y += 1) {
    for (let x = 0; x < resolutionWidth; x += 1) {
      const i = (y * resolutionWidth + x) * 4
      if (parsedPixels[i + 2] > 40) {
        instances.push(x / resolutionWidth, y / resolutionHeight) // normalized, flipped Y
        // instances.push(parsedPixels[i] / 255, parsedPixels[i + 1] / 255, parsedPixels[i + 2] / 255)
        const bri = parsedPixels[i + 2] / 255
        instances.push(bri, bri, bri)
      }
    }
  }

  dotInstance.setInstances(instances)
  dotInstance.setSize(0.1 / resolutionHeight)
  screenRenderer.render([dotInstance])
}
renderVideo()
