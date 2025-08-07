import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'
import { getGL } from './renderers/gl'
import { Shader } from './renderers/shader'
import { FrameBuffer } from './renderers/frameBuffer'
import instanceVert from './renderers/shaders/instance.vert?raw'
import instanceFrag from './renderers/shaders/instance.frag?raw'
import screenVert from './renderers/shaders/screen.vert?raw'
import screenFrag from './renderers/shaders/screen.frag?raw'
import { Texture } from './renderers/texture'
import { GenericModel, InstancedModel } from './renderers/model'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.3 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

const gl = getGL()

const instanceShader = new Shader(instanceVert, instanceFrag)

// frame buffer
const frameBufferWidth = 800
const frameBufferHeight = 800
const frameBuffer = new FrameBuffer(frameBufferWidth, frameBufferHeight)

// quad
const quadVertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5])
const quad = new InstancedModel(
  instanceShader,
  quadVertices,
  [
    {
      name: 'aPos',
      size: 2,
      stride: 0,
      offset: 0,
    },
  ],
  [
    {
      name: 'aOffset',
      size: 2,
      stride: (2 + 3) * 4,
      offset: 0,
      divisor: 1,
    },
    {
      name: 'aColor',
      size: 3,
      stride: (2 + 3) * 4,
      offset: 2 * 4,
      divisor: 1,
    },
  ]
)

// set up rect
const screenShader = new Shader(screenVert, screenFrag)
// prettier-ignore
const screenRectVertices = new Float32Array([
  -1, -1, 0, 1,
  1, -1, 1, 1,
  -1, 1, 0, 0,
  1, 1, 1, 0
])

const screenRect = new GenericModel(screenShader, screenRectVertices, [
  { name: 'aPos', size: 2, stride: 16, offset: 0 },
  { name: 'aUV', size: 2, stride: 16, offset: 8 },
])

const texture = new Texture()
screenShader.use()
screenShader.setUniformInt('uTexture', texture.id)

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
