import { getGL } from './renderers/gl'
import { Shader } from './renderers/shader'
import { InstancedModel, Model, ModelWithUV } from './renderers/model/model'
import { FrameBuffer } from './renderers/frameBuffer'
import vs1 from './renderers/shaders/triangle.vert?raw'
import fs1 from './renderers/shaders/triangle.frag?raw'
import vs2 from './renderers/shaders/instance.vert?raw'
import fs2 from './renderers/shaders/instance.frag?raw'
import screenVert from './renderers/shaders/screen.vert?raw'
import screenFrag from './renderers/shaders/screen.frag?raw'
import { Texture } from './renderers/texture'

const gl = getGL()

const triangleShader = new Shader(vs1, fs1)
const instanceShader = new Shader(vs2, fs2)

// triangle
const triVertices = new Float32Array([0, 0.8, -0.8, -0.6, 0.8, -0.6])
const triangle = new Model(triangleShader, triVertices)

// frame buffer
const frameBufferWidth = 800
const frameBufferHeight = 800
const frameBuffer = new FrameBuffer(frameBufferWidth, frameBufferHeight)

// dot
const quadVertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5])
const quad = new InstancedModel(instanceShader, quadVertices)

let angle = 0

// set up rect
const screenShader = new Shader(screenVert, screenFrag)
// prettier-ignore
const screenRectVertices = new Float32Array([
  -1, -1, 0, 1,
  1, -1, 1, 1,
  -1, 1, 0, 0,
  1, 1, 1, 0
])
const screenRect = new ModelWithUV(screenShader, screenRectVertices)

const texture = new Texture()
screenShader.use()
screenShader.setUniformInt('uTexture', texture.id)

const video = document.getElementById('video') as HTMLVideoElement
video.playbackRate = 3

function renderVideo() {
  requestAnimationFrame(renderVideo)

  if (video.readyState < HTMLVideoElement.prototype.HAVE_CURRENT_DATA) return

  frameBuffer.activate()

  gl.clearColor(0.5, 0.2, 0.2, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  screenRect.shader.use()
  texture.setTextureImage(video)
  screenRect.draw()

  // === READ PIXELS ===
  const pixels = frameBuffer.readPixels()

  // === DETECT BRIGHT PIXELS ===
  const offsets = []
  for (let y = 0; y < frameBufferHeight; y += 2) {
    for (let x = 0; x < frameBufferWidth; x += 2) {
      const i = (y * frameBufferHeight + x) * 4
      if (pixels[i] > 120) {
        offsets.push(x / frameBufferWidth, y / frameBufferHeight) // normalized, flipped Y
        offsets.push(pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255)
      }
    }
  }

  quad.setInstances(offsets)

  frameBuffer.deactivate()

  // === PASS 2: draw dots ===
  gl.viewport(0, 0, window.innerWidth, window.innerHeight)
  gl.clearColor(0.2, 0.2, 0.2, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  quad.shader.use()
  quad.setUniformFloat('uSize', 1.0/ frameBufferWidth)
  quad.draw()
}
renderVideo()

function render() {
  requestAnimationFrame(render)
  // angle += 0.01

  // === PASS 1: draw triangle to texture ===
  frameBuffer.activate()

  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  triangle.shader.use()
  triangle.setUniformFloat('uAngle', angle)
  triangle.draw()

  // === READ PIXELS ===
  const pixels = frameBuffer.readPixels()

  // === DETECT BRIGHT PIXELS ===
  const offsets = []
  for (let y = 0; y < frameBufferHeight; y += 4) {
    for (let x = 0; x < frameBufferWidth; x += 4) {
      const i = (y * frameBufferHeight + x) * 4
      if (pixels[i] > 20) {
        offsets.push(x / frameBufferWidth, y / frameBufferHeight) // normalized, flipped Y
        offsets.push(pixels[i] / 255, pixels[i + 1] / 255, pixels[i + 2] / 255)
      }
    }
  }

  quad.setInstances(offsets)

  frameBuffer.deactivate()

  // // === PASS 2: draw dots ===
  gl.viewport(0, 0, window.innerWidth, window.innerHeight)
  gl.clearColor(0.2, 0.2, 0.2, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  quad.shader.use()
  quad.setUniformFloat('uSize', 0.5 / frameBufferWidth)
  quad.draw()
}

// render()
