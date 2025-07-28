import { Renderer } from './Renderer'
import { createProgram } from '../gl'
import vert from '../shaders/dots.vert?raw'
import frag from '../shaders/dots.frag?raw'

export class DotsRenderer extends Renderer {
  constructor() {
    const program = createProgram(vert, frag)
    super(program)
    this.setup()
    this.setRadius(0.01)
  }

  private quadVAO!: WebGLVertexArrayObject

  private instanceVBO!: WebGLBuffer
  private instanceCount: number = 0

  private setup() {
    const quadVertices = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5])

    const quadVBO = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quadVBO)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, quadVertices, this.gl.STATIC_DRAW)

    this.quadVAO = this.gl.createVertexArray()!
    this.gl.bindVertexArray(this.quadVAO)

    const aPosition = this.gl.getAttribLocation(this.program, 'aPosition')
    this.gl.enableVertexAttribArray(aPosition)
    this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0)


    // Create empty VBO for instance data
    this.instanceVBO = this.gl.createBuffer()!
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instanceVBO)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, 1000 * 2 * 4, this.gl.DYNAMIC_DRAW) // enough space for 1000 vec2s

    const aInstance = this.gl.getAttribLocation(this.program, 'aInstance')
    this.gl.enableVertexAttribArray(aInstance)
    this.gl.vertexAttribPointer(aInstance, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.vertexAttribDivisor(aInstance, 1) // advance per instance

    this.gl.bindVertexArray(null)
  }

  setDotPositions(positions: Float32Array) {
    this.instanceCount = positions.length / 2
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.instanceVBO)
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, positions)
  }

  setRadius(radius: number) {
    const uRadius = this.gl.getUniformLocation(this.program, 'uRadius')
    this.gl.uniform1f(uRadius, radius)
  }

  /**
   * draw screen rect with texture
   */
  draw() {
    this.use()

    // this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    // this.gl.clearColor(0.0, 0.0, 0.0, 1.0)

    this.gl.bindVertexArray(this.quadVAO)
    this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, this.instanceCount)
  }
}
