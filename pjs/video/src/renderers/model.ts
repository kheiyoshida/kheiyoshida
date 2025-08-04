import { Shader } from './shader'
import { getGL } from './gl'

/**
 * Model that accepts 2d vertices, not more than that
 */
export class Model {
  public vbo: WebGLBuffer
  public vao: WebGLVertexArrayObject
  protected vertexCount: number

  constructor(public shader: Shader, dataArray: Float32Array) {
    const gl = getGL()

    // data
    this.vbo = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    gl.bufferData(gl.ARRAY_BUFFER, dataArray, gl.STATIC_DRAW)
    this.vertexCount = dataArray.length / 2 // 2 per vertex

    // vao
    // TODO: implement a uniform way to do this
    this.vao = gl.createVertexArray()!
    gl.bindVertexArray(this.vao)
    const aPosT = gl.getAttribLocation(shader.program, 'aPos')
    gl.enableVertexAttribArray(aPosT)
    gl.vertexAttribPointer(aPosT, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)
  }

  // remember to call shader.use() before calling methods below

  draw() {
    const gl = getGL()
    gl.bindVertexArray(this.vao)
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount)
  }

  setUniformFloat(name: string, value: number) {
    const gl = getGL()
    gl.uniform1f(gl.getUniformLocation(this.shader.program, name), value)
  }
}

// TODO: inherit Model
/**
 * model that accepts 2d vertices and UVs as data
 */
export class ModelWithUV {
  public vbo: WebGLBuffer
  public vao: WebGLVertexArrayObject
  protected vertexCount: number

  constructor(public shader: Shader, dataArray: Float32Array) {
    const gl = getGL()

    // data
    this.vbo = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    gl.bufferData(gl.ARRAY_BUFFER, dataArray, gl.STATIC_DRAW)
    this.vertexCount = dataArray.length / 4 // 4 values per vertex

    // vao
    this.vao = gl.createVertexArray()!
    gl.bindVertexArray(this.vao)
    const aPosT = gl.getAttribLocation(shader.program, 'aPos')
    gl.enableVertexAttribArray(aPosT)
    gl.vertexAttribPointer(aPosT, 2, gl.FLOAT, false, 16, 0)

    const aUV = gl.getAttribLocation(shader.program, 'aUV')
    gl.enableVertexAttribArray(aUV)
    gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 16, 8) // 4bytes x2 for position

    gl.bindVertexArray(null)
  }

  // remember to call shader.use() before calling methods below

  draw() {
    const gl = getGL()
    gl.bindVertexArray(this.vao)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertexCount)
  }

  setUniformFloat(name: string, value: number) {
    this.shader.setUniformFloat(name, value)
  }
}

/**
 * Instanced model that can be placed repeatedly at aOffset positions, not more than that
 */
export class InstancedModel extends Model {
  public offsetVBO: WebGLBuffer

  constructor(shader: Shader, dataArray: Float32Array) {
    super(shader, dataArray)

    const gl = getGL()
    this.offsetVBO = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetVBO)

    gl.bindVertexArray(this.vao)
    const aOffset = gl.getAttribLocation(shader.program, 'aOffset')
    gl.enableVertexAttribArray(aOffset)
    gl.vertexAttribPointer(aOffset, 2, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(aOffset, 1)
    gl.bindVertexArray(null)
  }

  private offsetCount = 0

  setOffsets(offsets: number[]) {
    const gl = getGL()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.offsetVBO)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW)
    this.offsetCount = offsets.length /2
  }

  override draw() {
    const gl = getGL()
    gl.bindVertexArray(this.vao)
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, this.vertexCount, this.offsetCount)
  }
}
