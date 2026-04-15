import { ScreenEffectModel } from '../../../../lib-node/effect/node'
import vert from './screen.vert?raw'
import frag from './edge.frag?raw'
import dist from './dist.frag?raw'
import { getGL, OffscreenDrawNode, Shader, TextureUnit } from 'graph-gl'

class EdgeDrawEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, frag))

    this.shader.setUniformInt('uNormalTexture', TextureUnit.Normal)
    this.shader.setUniformInt('uDepthTexture', TextureUnit.Depth)
    this.shader.setUniformFloat2('uResolution', getGL().canvas.width, getGL().canvas.height)
  }

  public normalTexture?: WebGLTexture
  public depthTexture?: WebGLTexture

  override draw() {
    const gl = getGL()

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.normalTexture!)

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture!)

    super.draw()
  }
}

export class EdgeDrawNode extends OffscreenDrawNode {
  private readonly fx: EdgeDrawEffect
  constructor() {
    super()
    this.fx = new EdgeDrawEffect()
    this.drawables.push(this.fx)
  }

  public setInput(sceneNode: OffscreenDrawNode) {
    this.fx.tex = sceneNode.renderTarget!.frameBuffer.colorTexture.tex
    this.fx.normalTexture = sceneNode.renderTarget!.frameBuffer.normalTexture!.tex
    this.fx.depthTexture = sceneNode.renderTarget!.frameBuffer.depthTexture!.tex
  }
}

export class DistortionFx extends ScreenEffectModel {
  constructor() {
    super(new Shader(vert, dist))
    this.shader.setUniformFloat2('uResolution', getGL().canvas.width, getGL().canvas.height)
  }
}

export class DistortionNode extends OffscreenDrawNode {
  private fx: DistortionFx
  constructor() {
    super()
    this.fx = new DistortionFx()
    this.drawables = [this.fx]
  }
  public setInput(sceneNode: OffscreenDrawNode) {
    this.fx.tex = sceneNode.renderTarget!.frameBuffer.colorTexture.tex
  }
}
