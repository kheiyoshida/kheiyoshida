import { getGL } from './gl'

export class Shader {
  public program: WebGLProgram

  constructor(vsSrc: string, fsSrc: string) {
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
    this.program = program
  }

  use() {
    getGL().useProgram(this.program)
  }
}

// Compile shader
function compileShader(src: string, type: number) {
  const gl = getGL()
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || undefined)
  }
  return shader
}
