import { ScreenEffectModel } from '../../../lib-node/effect/node'
import { ImageResolution, Shader } from 'graph-gl'
import vert from './screen.vert?raw'
import frag from './convert.frag?raw'

export class NoiseEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))
  }

  public setResolution(resolution: ImageResolution) {
    this.shader.use()
    this.shader.setUniformFloat2('uResolution', resolution.width, resolution.height)
  }

  public override draw() {
    this.shader.use()
    this.shader.setUniformFloat('uTime', performance.now() / 1000)
    super.draw()
  }
}
