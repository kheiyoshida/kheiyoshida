import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'
import { getGL } from './renderers/gl'
import { FrameBuffer } from './renderers/frameBuffer'
import { Texture } from './renderers/texture'
import { ScreenRect } from './renderers/model/screen'
import { DotInstance } from './renderers/model/dot'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.3 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

const gl = getGL()

// frame buffer
const frameBufferWidth = 800
const frameBufferHeight = 800
const frameBuffer = new FrameBuffer(frameBufferWidth, frameBufferHeight)

const quad = new DotInstance()

const texture = new Texture()
const screenRect = new ScreenRect(texture)

function renderVideo() {
  requestAnimationFrame(renderVideo)

  if (!videoSupply) return
  if (videoSupply.currentVideo.readyState < HTMLVideoElement.prototype.HAVE_CURRENT_DATA) return

  if (Math.random() < 0.003) {
    videoSupply.swapVideo()
  }

  frameBuffer.activate()

  gl.clearColor(0.5, 0.2, 0.2, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  screenRect.shader.use()
  texture.setTextureImage(videoSupply.currentVideo)
  screenRect.draw(gl.TRIANGLE_STRIP)

  // === READ PIXELS ===
  const pixels = frameBuffer.readPixels()

  // === DETECT BRIGHT PIXELS ===
  const offsets = []
  for (let y = 0; y < frameBufferHeight; y += 4) {
    for (let x = 0; x < frameBufferWidth; x += 2) {
      const i = (y * frameBufferHeight + x) * 4
      if (pixels[i + 2] > 120) {
        offsets.push(x / frameBufferWidth, y / frameBufferHeight) // normalized, flipped Y
        offsets.push(pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255)
      }
    }
  }

  quad.setInstances(offsets)

  frameBuffer.deactivate()

  // === PASS 2: draw dots ===
  gl.viewport(0, 0, window.innerWidth, window.innerHeight)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  quad.shader.use()
  quad.shader.setUniformFloat('uSize', 2.0 / frameBufferWidth)
  quad.draw()
}
renderVideo()
