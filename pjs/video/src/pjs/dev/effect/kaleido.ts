import { Shader } from '../../../gl/shader'
import vert from './kaleido.vert?raw'
import frag from './kaleido.frag?raw'
import { FrameBuffer } from '../../../gl/frameBuffer'
import { InstancedModel } from '../../../gl/model/model'
import { getGL } from '../../../gl/gl'
import { IEffectModel } from '../../../lib/effect/slot'

export class KaleidoscopeEffectModel extends InstancedModel implements IEffectModel {
  constructor(maxInstanceCount: number) {
    const instanceShader = new Shader(vert, frag)

    // // prettier-ignore
    // const triangleVertices = new Float32Array([
    //   0, 0,  0, 0,
    //   1, 1,  1, 1,
    //   1, -1, 1, 0
    // ])
    // prettier-ignore
    const triangleVertices = new Float32Array([
      0, 0,  0, 0,
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
    this.numOfTriangles = 4
    this.shader.setUniformInt('uTexture', 0)
    this.startAngle = 60
  }

  private tex: WebGLTexture | undefined
  setInput(inputFrameBuffer: FrameBuffer): void {
    this.tex = inputFrameBuffer.tex
  }
  enabled: boolean = true

  public setAnglePerTriangle(num: number) {
    this.shader.use()
    this.shader.setUniformFloat('uAnglePerTriangle', num)
  }

  public updateInstanceData() {
    const anglePerTriangle = 360 / this.numOfTriangles
    this.setAnglePerTriangle(anglePerTriangle)

    let k = 0
    for (let i = 0; i < this.numOfTriangles; i++) {
      this.instanceDataArray[k++] = this.startAngle + anglePerTriangle * i
      this.instanceDataArray[k++] = i % 2 == 0 ? 1.0 : 0.0
    }

    this.updateInstances(this.numOfTriangles)
  }

  private _numOfTriangles: number = 4
  public set numOfTriangles(numOfTriangles: number) {
    if (numOfTriangles < 4) numOfTriangles = 4
    this._numOfTriangles = numOfTriangles
    this.updateInstanceData()
  }
  public get numOfTriangles(): number {
    return this._numOfTriangles
  }

  public startAngle = 0
  // public set startAngle(val: number) {
  //   this._startAngle = val
  //   this.updateInstanceData()
  // }
  // public get startAngle(): number {
  //   return this._startAngle
  // }

  public setCenter(x: number, y: number) {
    this.shader.use()
    this.shader.setUniformFloat2('uCenterPos', x, y)
  }

  private _textureOffset = 0;
  public set textureOffset(value: number) {
    this._textureOffset = value;
    this.shader.use()
    this.shader.setUniformFloat('uTextureOffset', this._textureOffset)
  }
  public get textureOffset() {
    return this._textureOffset
  }

  public override draw(mode: number = getGL().TRIANGLE_STRIP) {
    const gl = getGL()
    gl.bindTexture(gl.TEXTURE_2D, this.tex!)
    super.draw(mode)
  }
}
