import { PostEffect } from '../../../lib/effect/effect'
import { Shader } from '../../../gl/shader'
import vert from './multiply.vert?raw'
import frag from './multiply.frag?raw'
import { FrameBuffer } from '../../../gl/frameBuffer'
import { InstancedModel } from '../../../gl/model/model'
import { getGL } from '../../../gl/gl'
import { IEffectModel } from '../../../lib/effect/slot'

export class MultiplyEffectModel extends InstancedModel implements IEffectModel {
  public tex: WebGLTexture | undefined

  constructor(readonly maxMultiply = 16) {
    const instanceShader = new Shader(vert, frag)

    // prettier-ignore
    const rectVertices = new Float32Array([
      -1, -1, 0, 0,
      1, -1, 1, 0,
      -1, 1, 0, 1,
      1, 1, 1, 1
    ])
    super(
      instanceShader,
      rectVertices,
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
          name: 'aOffset',
          size: 2,
          stride: 2 * 4,
          offset: 0,
          divisor: 1,
        },
      ],
      Math.pow(maxMultiply, 2)
    )

    this.shader.use()
    this.shader.setUniformInt('uTexture', 0)
  }

  setInput(inputFrameBuffer: FrameBuffer): void {
    this.tex = inputFrameBuffer.tex
  }
  enabled: boolean = true

  private setNum(num: number) {
    this.shader.use()
    this.shader.setUniformInt('uNum', num)
  }

  public setMultiply(num: number) {
    if (num < 1) {
      num = 1
    }
    if (num > this.maxMultiply) {
      num = this.maxMultiply
    }

    const numOfInstances = Math.pow(num, 2)
    this.setNum(num)

    let k = 0
    for (let y = 0; y < num; y++) {
      for (let x = 0; x < num; x++) {
        // aOffset
        this.instanceDataArray[k++] = x
        this.instanceDataArray[k++] = y
      }
    }

    this.updateInstances(numOfInstances)
  }

  public validate() {
    if (!this.tex) throw Error(`texture not set`)
  }

  public override draw(mode: number = getGL().TRIANGLE_STRIP) {
    const gl = getGL()
    gl.bindTexture(gl.TEXTURE_2D, this.tex!)
    super.draw(mode)
  }
}

export class MultiplyEffect extends PostEffect {
  private readonly rectModel: MultiplyEffectModel

  public setInput(inputFrameBuffer: FrameBuffer): void {
    this.rectModel.tex = inputFrameBuffer.tex
  }

  public constructor(private readonly maxMultiply: number) {
    super()

    this.rectModel = new MultiplyEffectModel(maxMultiply)
    this.models.push(this.rectModel)
    this.rectModel.setMultiply(1)
  }

  private _multiply = 1
  public set multiply(value: number) {
    if (value > this.maxMultiply) {
      this.rectModel.setMultiply(this.maxMultiply)
    } else {
      this.rectModel.setMultiply(value)
    }
  }
  public get multiply(): number {
    return this._multiply
  }
}
