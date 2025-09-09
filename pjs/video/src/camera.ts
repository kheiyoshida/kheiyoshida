import { getGL } from './gl/gl'
import { Texture } from './gl/texture'
import { DotInstance } from './gl/model/dot'
import { OffScreenTexturePass } from './gl/pass/offscreen'
import { ScreenPass } from './gl/pass/pass'
import { setupCamera } from './media/camera'

const videoEl = await setupCamera()

getGL()

const videoTexture = new Texture()
const frameBufferWidth = 320
const frameBufferHeight = 180
const offscreenTextureRenderer = new OffScreenTexturePass(
  videoTexture,
  frameBufferWidth,
  frameBufferHeight
)

const screenRenderer = new ScreenPass()
screenRenderer.backgroundColor = [0, 0, 0, 1]
const dotInstance = new DotInstance()

function renderVideo() {
  requestAnimationFrame(renderVideo)

  if (!videoEl) return
  if (videoEl.readyState < HTMLVideoElement.prototype.HAVE_CURRENT_DATA) return

  videoTexture.setTextureImage(videoEl)
  const pixels = offscreenTextureRenderer.renderAsPixels()

  const instances = []
  for (let y = 0; y < frameBufferHeight; y += 2) {
    for (let x = 0; x < frameBufferWidth; x += 2) {
      const i = (y * frameBufferWidth + x) * 4
      if (pixels[i + 2] > 30) {
        instances.push(x / frameBufferWidth, y / frameBufferHeight) // normalized, flipped Y
        instances.push(pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255)
        instances.push(0.3 / frameBufferHeight)
      }
    }
  }

  dotInstance.setInstances(instances)
  dotInstance.setSize(0.3 / frameBufferHeight)
  screenRenderer.render([dotInstance])
}
renderVideo()
