import { PostEffect } from '../../../lib/effect/effect'
import { Shader } from '../../../gl/shader'
import vert from './kaleido.vert?raw'
import frag from './kaleido.frag?raw'
import { FrameBuffer } from '../../../gl/frameBuffer'
import { GenericModel, InstancedModel } from '../../../gl/model/model'
import { getGL } from '../../../gl/gl'

class TriangleInstance extends InstancedModel {
  constructor(
    private tex: WebGLTexture,
    maxInstanceCount: number
  ) {
    const instanceShader = new Shader(vert, frag)

    // prettier-ignore
    const triangleVertices = new Float32Array([
      0, 0,  0.5, 0.5,
      1, 1,  1, 1,
      1, -1, 1, 0
    ])
    super(
      instanceShader,
      triangleVertices,
      [
        {
          name: 'aPos',
          size: 2,
          stride: (2 + 2) * 4,
          offset: 0,
        },
        {
          name: 'aUV',
          size: 2,
          stride: (2 + 2) * 4,
          offset: 2 * 4,
        },
      ],
      [
        {
          name: 'aStartAngle',
          size: 1,
          stride: (1 + 1) * 4,
          offset: 0,
          divisor: 1,
        },
        {
          name: 'aSign',
          size: 1,
          stride: (1 + 1) * 4,
          offset: 4,
          divisor: 1,
        },
      ],
      maxInstanceCount
    )

    this.shader.use()
    this.shader.setUniformInt('uTexture', 0)
  }

  public setAnglePerTriangle(num: number) {
    this.shader.use()
    this.shader.setUniformFloat('uAnglePerTriangle', num)
  }

  public override draw(mode: number = getGL().TRIANGLE_STRIP) {
    const gl = getGL()
    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    super.draw(mode)
  }
}

export class KaleidoscopeEffect extends PostEffect {
  public setInput(inputFrameBuffer: FrameBuffer): void {

  }

  private readonly triangleModel: TriangleInstance

  public constructor(input: FrameBuffer, output: FrameBuffer, numOfTriangles = 4) {
    super(output)

    this.triangleModel = new TriangleInstance(input.tex, 24)
    this.models.push(this.triangleModel)
    this._numOfTriangles = numOfTriangles
    this.updateInstanceData()
  }

  public updateInstanceData() {
    const anglePerTriangle = 360 / this.numOfTriangles
    this.triangleModel.setAnglePerTriangle(anglePerTriangle)

    let k = 0
    for (let i = 0; i < this.numOfTriangles; i++) {
      this.triangleModel.instanceDataArray[k++] = this._startAngle + anglePerTriangle * i
      this.triangleModel.instanceDataArray[k++] = i % 2 == 0 ? 1.0 : 0.0
    }

    this.triangleModel.updateInstances(this.numOfTriangles)
  }

  private _numOfTriangles: number
  public set numOfTriangles(numOfTriangles: number) {
    if (numOfTriangles < 4) throw new Error(`invalid num of triangles`)
    this._numOfTriangles = numOfTriangles
    this.updateInstanceData()
  }
  public get numOfTriangles(): number {
    return this._numOfTriangles
  }

  private _startAngle = 0
  public set startAngle(val: number) {
    this._startAngle = val
    this.updateInstanceData()
  }
  public get startAngle(): number {
    return this._startAngle
  }

  static factory(input: FrameBuffer, output: FrameBuffer): PostEffect {
    return new KaleidoscopeEffect(input, output, 8)
  }
}
