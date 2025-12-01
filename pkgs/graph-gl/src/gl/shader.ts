import { getGL } from './gl'
import { mat4, vec3, vec4 } from 'gl-matrix'

export class Shader {
  public program: WebGLProgram
  protected gl: WebGL2RenderingContext

  constructor(vsSrc: string, fsSrc: string) {
    const gl = getGL()
    this.gl = gl
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

  private static currentProgram: WebGLProgram | null = null

  use() {
    if (Shader.currentProgram != this.program) {
      Shader.currentProgram = this.program
      getGL().useProgram(this.program)
    }
  }

  setUniformFloat(name: string, value: number) {
    getGL().uniform1f(this.getUniformLoc(name), value)
  }

  setUniformInt(name: string, value: number) {
    getGL().uniform1i(this.getUniformLoc(name), value)
  }

  setUniformFloat2(name: string, x: number, y: number) {
    getGL().uniform2f(this.getUniformLoc(name), x, y)
  }

  setUniformMatrix4(name: string, matrix: Float32Array | mat4) {
    getGL().uniformMatrix4fv(this.getUniformLoc(name), false, matrix)
  }

  setUniformVec3(name: string, value: Float32Array | vec3) {
    getGL().uniform3fv(this.getUniformLoc(name), value)
  }

  setUniform4fv(name: string, value: vec4) {
    getGL().uniform4fv(this.getUniformLoc(name), value)
  }

  /**
   * get the location of shader attribute
   * @param name attribute name
   */
  getAttribLoc(name: string): number {
    return getGL().getAttribLocation(this.program, name)
  }

  private getUniformLoc(name: string) {
    return getGL().getUniformLocation(this.program, name)
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
