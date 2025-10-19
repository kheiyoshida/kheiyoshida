import vert from './multiply.vert?raw'
import frag from './multiply.frag?raw'
import { fireByRate } from 'utils'
import { RangedValue } from '../../utils/rangedValue'
import { FrameBuffer, getGL, InstancedModel, Shader } from 'graph-gl'
import { IEffectModel } from '../../../../lib-node/effect/node'

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
    this.setMultiply(1)
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

  public multiply = new RangedValue(1, this.maxMultiply, 1, this.maxMultiply)
  public sensitivity: number = 0
  public randomiseMultiply(baseRate: number) {
    if (fireByRate(baseRate * this.sensitivity)) {
      this.setMultiply(Math.floor(this.multiply.updateValue(Math.random())))
    }
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
