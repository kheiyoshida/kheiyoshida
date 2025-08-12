import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'
import { getGL } from './gl/gl'
import { FrameBuffer } from './gl/frameBuffer'
import { Texture } from './gl/texture'
import { ScreenRect } from './gl/model/screen'
import { DotInstance } from './gl/model/dot'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.3 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

const gl = getGL()

// frame buffer
const frameBufferWidth = 320
const frameBufferHeight = 180

const frameBuffer = new FrameBuffer(frameBufferWidth, frameBufferHeight)

const dotInstance = new DotInstance()

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


  gl.clear(gl.COLOR_BUFFER_BIT)

  screenRect.shader.use()
  texture.setTextureImage(videoSupply.currentVideo)
  screenRect.draw()

  // === READ PIXELS ===
  const pixels = frameBuffer.readPixels()

  // === DETECT BRIGHT PIXELS ===
  const instances = []
  for (let y = 0; y < frameBufferHeight; y += 1) {
    for (let x = 0; x < frameBufferWidth; x += 1) {
      const i = (y * frameBufferWidth + x) * 4
      if (pixels[i + 2] > 30) {
        instances.push(x / frameBufferWidth, y / frameBufferHeight) // normalized, flipped Y
        instances.push(pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255)
      }
    }
  }

  dotInstance.setInstances(instances)

  frameBuffer.deactivate()

  // === PASS 2: draw dots ===
  gl.viewport(0, 0, window.innerWidth, window.innerHeight)
  gl.clearColor(0, 0, 0, 1)

  gl.clear(gl.COLOR_BUFFER_BIT)

  dotInstance.setSize(1.0 / frameBufferHeight)
  dotInstance.draw()
}
renderVideo()
