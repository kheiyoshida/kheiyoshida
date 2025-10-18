import { FrameBuffer, getGL, Shader } from './gl'

async function main() {
  const gl = getGL()

  const width = 160,
    height = 90

  const framebuffer = new FrameBuffer(width, height)

  // === 3. Compile trivial shaders ===
  const vert = `#version 300 es
in vec2 pos;
void main() {
  gl_Position = vec4(pos, 0.0, 1.0);
}`
  const frag = `#version 300 es
precision mediump float;
out vec4 fragColor;
uniform vec4 uColor;
void main() {
  fragColor = uColor;
}`
  const shader = new Shader(vert, frag)
  shader.use()

  const posLoc = gl.getAttribLocation(shader.program, 'pos')
  const uColor = gl.getUniformLocation(shader.program, 'uColor')

  // === 4. Vertex buffer (one triangle) ===
  const vbo = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1,
      -1,
      3,
      -1,
      -1,
      3, // oversize tri
    ]),
    gl.STATIC_DRAW
  )
  gl.enableVertexAttribArray(posLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

  function drawFrame(i: number) {
    framebuffer.activate()

    // alternate colors per frame
    const color = i % 2 ? [1, 0, 0, 1] : [0, 1, 0, 1]
    gl.uniform4fv(uColor, color)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    // === Read pixels ===
    const pixels = framebuffer.readPixels()

    // Sample a few values
    console.log(`frame ${i}`, pixels.slice(0, 12)) // first few pixels

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  drawFrame(0)
  drawFrame(1)
  drawFrame(2)
}

// eslint-disable-next-line no-console
void main().catch(console.error)
