let gl: WebGL2RenderingContext

export const getGL = (): WebGL2RenderingContext => {
  if (gl) return gl

  const canvas = document.getElementById('canvas')! as HTMLCanvasElement

  gl = canvas.getContext('webgl2')!

  // Resize canvas to fill the screen
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  gl.viewport(0, 0, canvas.width, canvas.height)

  return canvas.getContext('webgl2')!
}

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
export function createProgram(vsSrc: string, fsSrc: string) {
  const gl = getGL()
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
