import { ModelBase } from '../../lib/model/model.ts'
import { GeometrySpec } from '../../lib/model/parse.ts'
import depthLine from './depth.frag?raw'
import vert from '../../lib/model/default.vert?raw'
import { Shader } from 'graph-gl'

export class DepthRenderingModel extends ModelBase {
  constructor(geometry: GeometrySpec) {
    super(geometry, new Shader(vert, depthLine))
  }

  // public setResolution(width: number, height: number) {
  //   this.shader.use()
  //   this.shader.setUniformFloat2('uResolution', width, height)
  // }

  public setTme(t: number) {
    this.shader.use()
    this.shader.setUniformFloat('uTime', t)
  }
}
