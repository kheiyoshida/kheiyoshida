import { generateRandomNumber } from '../../utils/calc'
import { getGL } from '../../webgl'
import type { mat3, mat4, vec3, vec4 } from 'gl-matrix'

export class Shader {
  protected program: WebGLProgram
  protected gl: WebGL2RenderingContext

  constructor(
    vertSource: string,
    fragSource: string,
    private id = generateRandomNumber()
  ) {
    this.gl = getGL()
    const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertSource)
    const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragSource)
    this.program = createProgram(this.gl, vertexShader, fragmentShader)
  }

  static currentShaderId: number

  /**
   * use the shader program
   * if no switching occurs from the previously used program, it skips
   */
  use() {
    if (Shader.currentShaderId === this.id) return
    this.gl.useProgram(this.program)
    Shader.currentShaderId = this.id
  }

  setMat3(uniformValueName: string, matrix: mat3) {
    this.gl.uniformMatrix3fv(this.#getUniformLoc(uniformValueName), false, matrix)
  }

  setMat4(uniformValueName: string, matrix: mat4) {
    this.gl.uniformMatrix4fv(this.#getUniformLoc(uniformValueName), false, matrix)
  }

  setVec3(uniformValueName: string, vec: vec3) {
    this.gl.uniform3fv(this.#getUniformLoc(uniformValueName), vec)
  }

  setVec4(uniformValueName: string, vec: vec4) {
    this.gl.uniform4fv(this.#getUniformLoc(uniformValueName), vec)
  }

  setInt(uniformValueName: string, val: number) {
    this.gl.uniform1i(this.#getUniformLoc(uniformValueName), val)
  }

  setFloat(uniformValueName: string, val: number) {
    this.gl.uniform1f(this.#getUniformLoc(uniformValueName), val)
  }

  /**
   * get the location of shader attribute
   * @param name attribute name
   */
  getAttribLoc(name: string): number {
    return this.gl.getAttribLocation(this.program, name)
  }

  #getUniformLoc(uniformValueName: string) {
    return this.gl.getUniformLocation(this.program, uniformValueName)
  }
}

function createShader(gl: WebGL2RenderingContext, type: GLenum, glslSource: string) {
  const shader = gl.createShader(type)
  if (!shader) throw Error(`could not create shader`)

  gl.shaderSource(shader, glslSource)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  const msg = gl.getShaderInfoLog(shader)
  gl.deleteShader(shader)
  throw Error(`could not compile shader: ${msg}`)
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram()
  if (!program) throw Error(`could not create program`)

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  const msg = gl.getProgramInfoLog(program)
  gl.deleteProgram(program)
  throw Error(`could not compile program: ${msg}`)
}
