import vertexSrc from './renderers/shaders/dev.vert?raw'
import fragmentSrc from './renderers/shaders/dev.frag?raw'
import { makeVideoSupply, VideoSupply } from './media/video/supply'
import { prepareVideoElements } from './media/video/load'
import { videoSourceList } from './pjs/shinjuku/videos'

let videoSupply: VideoSupply
prepareVideoElements(videoSourceList).then((videoElements) => {
  videoSupply = makeVideoSupply(videoElements, { speed: 0.1 })
  videoSupply.onEnded(() => videoSupply.swapVideo())
})

const canvas = document.getElementById('canvas')! as HTMLCanvasElement
const gl = canvas.getContext('webgl')!

// Resize canvas to fill the screen
canvas.width = window.innerWidth
canvas.height = window.innerHeight
gl.viewport(0, 0, canvas.width, canvas.height)

// Compile shader
function compileShader(src: string, type: number) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || undefined)
  }
  return shader
}

// Link program
function createProgram(vsSrc: string, fsSrc: string) {
  const vs = compileShader(vsSrc, gl.VERTEX_SHADER)
  const fs = compileShader(fsSrc, gl.FRAGMENT_SHADER)
  const program = gl.createProgram()!
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || undefined)
  }
  return program
}

const program = createProgram(vertexSrc, fragmentSrc)
gl.useProgram(program)

// Fullscreen quad (clip space -1 to +1)
// video texture starts from top-left as (0,0), while WebGL starts from bottom-left (-1, -1)
const vertices = new Float32Array([-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0])

const buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

const aPosition = gl.getAttribLocation(program, 'aPosition')
const aUV = gl.getAttribLocation(program, 'aUV')
gl.enableVertexAttribArray(aPosition)
gl.enableVertexAttribArray(aUV)
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 16, 0)
gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 16, 8)

const texture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

const uTexture = gl.getUniformLocation(program, 'uTexture')
gl.uniform1i(uTexture, 0) // texture unit 0

// const video = document.getElementById('video')! as HTMLVideoElement

// render loop
function render() {
  requestAnimationFrame(render)

  if (!videoSupply) return
  const video = videoSupply.currentVideo

  // inject video as texture
  if (video.readyState >= video.HAVE_CURRENT_DATA) {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
  }

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}
render()
