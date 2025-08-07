import { Shader } from './shader'
import { getGL } from './gl'

type AttributeDescriptor = {
  /**
   * name of the attribute.
   * e.g. aPos, aColor
   */
  name: string

  /**
   * size of the attribute data.
   * e.g. 2 (vec2), 3 (vec3)
   */
  size: number

  /**
   * type of attribute.
   * typically gl.FLOAT
   */
  type?: number
  normalized?: boolean
  stride?: number
  offset?: number
}

export class GenericModel {
  public vao: WebGLVertexArrayObject
  public vbo: WebGLBuffer
  protected vertexCount: number

  constructor(
    public shader: Shader,
    data: Float32Array,
    attributes: AttributeDescriptor[],
    usage: number = getGL().STATIC_DRAW
  ) {
    const gl = getGL()
    this.vao = gl.createVertexArray()!
    this.vbo = gl.createBuffer()!
    gl.bindVertexArray(this.vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    gl.bufferData(gl.ARRAY_BUFFER, data, usage)

    for (const attr of attributes) {
      const loc = gl.getAttribLocation(shader.program, attr.name)
      if (loc === -1) continue

      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(
        loc,
        attr.size,
        attr.type ?? gl.FLOAT,
        attr.normalized ?? false,
        attr.stride ?? 0,
        attr.offset ?? 0
      )
    }

    gl.bindVertexArray(null)

    this.vertexCount = data.length / attributes.reduce((pre, cur) => pre + cur.size, 0)
  }

  draw(mode: number = getGL().TRIANGLES) {
    const gl = getGL()
    gl.bindVertexArray(this.vao)
    gl.drawArrays(mode, 0, this.vertexCount)
  }
}

type InstanceAttributeDescriptor = AttributeDescriptor & {
  /**
   * divisor for instancing
   * 1 means "update attribute per instance"
   */
  divisor: number
}

export class InstancedModel extends GenericModel {
  public instanceVBO: WebGLBuffer

  protected instanceCount = 0
  protected readonly instanceLength: number

  constructor(
    shader: Shader,
    data: Float32Array,
    attributes: AttributeDescriptor[],
    instanceAttributes: InstanceAttributeDescriptor[],
    usage: number = getGL().STATIC_DRAW
  ) {
    super(shader, data, attributes, usage)

    const gl = getGL()
    this.instanceVBO = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceVBO)
    gl.bindVertexArray(this.vao)

    for (const attr of instanceAttributes) {
      const loc = gl.getAttribLocation(shader.program, attr.name)
      if (loc === -1) continue

      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(
        loc,
        attr.size,
        attr.type ?? gl.FLOAT,
        attr.normalized ?? false,
        attr.stride ?? 0,
        attr.offset ?? 0
      )
      if (attr.divisor !== undefined) {
        gl.vertexAttribDivisor(loc, attr.divisor)
      }
    }

    gl.bindVertexArray(null)

    this.instanceLength = instanceAttributes.reduce((pre, cur) => pre + cur.size, 0)
  }

  setInstances(instances: number[]) {
    const gl = getGL()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceVBO)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instances), gl.STATIC_DRAW)
    this.instanceCount = instances.length / this.instanceLength
  }

  override draw(mode: number = getGL().TRIANGLE_STRIP) {
    const gl = getGL()
    gl.bindVertexArray(this.vao)
    gl.drawArraysInstanced(mode, 0, this.vertexCount, this.instanceCount)
  }
}
