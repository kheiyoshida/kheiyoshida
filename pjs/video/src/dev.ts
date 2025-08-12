import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'
import { getGL } from './gl/gl'
import { Texture } from './gl/texture'
import { DotInstance } from './gl/model/dot'
import { OffScreenTextureRenderer } from './gl/renderers/offscreen'
import { ScreenRenderer } from './gl/renderers/renderer'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.3 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

getGL()

const videoTexture = new Texture()
const frameBufferWidth = 320
const frameBufferHeight = 180
const offscreenTextureRenderer = new OffScreenTextureRenderer(
  videoTexture,
  frameBufferWidth,
  frameBufferHeight
)

const screenRenderer = new ScreenRenderer()
screenRenderer.backgroundColor = [0, 0, 0, 1]
const dotInstance = new DotInstance()

function renderVideo() {
  requestAnimationFrame(renderVideo)

  if (!videoSupply) return
  if (videoSupply.currentVideo.readyState < HTMLVideoElement.prototype.HAVE_CURRENT_DATA) return

  if (Math.random() < 0.003) {
    videoSupply.swapVideo()
  }

  videoTexture.setTextureImage(videoSupply.currentVideo)
  const pixels = offscreenTextureRenderer.renderAsPixels()

  const instances = []
  for (let y = 0; y < frameBufferHeight; y += 1) {
    for (let x = 0; x < frameBufferWidth; x += 1) {
      const i = (y * frameBufferWidth + x) * 4
      if (pixels[i + 2] > 120) {
        instances.push(x / frameBufferWidth, y / frameBufferHeight) // normalized, flipped Y
        instances.push(pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255)
      }
    }
  }

  dotInstance.setInstances(instances)
  dotInstance.setSize(0.3 / frameBufferHeight)
  screenRenderer.render([dotInstance])
}
renderVideo()
