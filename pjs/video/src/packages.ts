import { getGL } from './renderers/gl'
import { Shader } from './renderers/shader'
import { InstancedModel, Model } from './renderers/model'
import { FrameBuffer } from './renderers/frameBuffer'

const gl = getGL()

// === SHADERS ===
// Draws a triangle to texture
const vs1 = `#version 300 es
in vec2 aPos;
uniform float uAngle;
void main() {
  float c = cos(uAngle), s = sin(uAngle);
  mat2 rot = mat2(c, -s, s, c);
  gl_Position = vec4(rot * aPos, 0, 1);
}`
const fs1 = `#version 300 es
precision mediump float;
out vec4 fragColor;
void main() {
  fragColor = vec4(1.0); // white
}`

// Draws a dot (quad) at each bright pixel
const vs2 = `#version 300 es
in vec2 aPos;
in vec2 aOffset;
uniform float uSize;
void main() {
  vec2 scaled = aPos * uSize;
  vec2 world = aOffset + scaled;
  gl_Position = vec4(world * 2.0 - 1.0, 0, 1);
}`
const fs2 = `#version 300 es
precision mediump float;
out vec4 fragColor;
void main() {
  fragColor = vec4(1.0, 0.0, 0.0, 1.0); // red
}`

const offscreenShader = new Shader(vs1, fs1)
const screenShader = new Shader(vs2, fs2)

// triangle
const triVertices = new Float32Array([0, 0.8, -0.8, -0.6, 0.8, -0.6])
const triangle = new Model(offscreenShader, triVertices)

// frame buffer
const frameBufferWidth = 800
const frameBufferHeight = 800
const frameBuffer = new FrameBuffer(frameBufferWidth, frameBufferHeight)

// dot
const quadVertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5])
const quad = new InstancedModel(screenShader, quadVertices)

let angle = 0

function render() {
  requestAnimationFrame(render)
  angle += 0.01

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
      if (pixels[i] > 128) {
        offsets.push(x / frameBufferWidth, 1 - y / frameBufferHeight) // normalized, flipped Y
      }
    }
  }

  quad.setOffsets(offsets)

  frameBuffer.deactivate()

  // === PASS 2: draw dots ===
  gl.viewport(0, 0, window.innerWidth, window.innerHeight)
  gl.clearColor(0.2, 0.2, 0.2, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  quad.shader.use()
  quad.setUniformFloat('uSize', 0.002)
  quad.draw()
}

render()
