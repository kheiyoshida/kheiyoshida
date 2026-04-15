import { ScreenRect, Shader } from 'graph-gl'
import vert from './screen.vert?raw'
import feature from './feature.frag?raw'
import { PixelDataProviderNode } from '../../../../../lib-node/channel/node'

export class FeatureDetectionNode extends PixelDataProviderNode {
  private readonly shader: Shader
  public readonly screenRect: ScreenRect

  private _tileSize: number = 8
  public set tileSize(value: number) {
    this._tileSize = value
    this.setTileSize(value)
  }
  public get tileSize() {
    return this._tileSize
  }

  constructor(tileSize: number) {
    super()
    this.shader = new Shader(vert, feature)
    this.screenRect = new ScreenRect(this.shader)
    this.drawables.push(this.screenRect)

    this.tileSize = tileSize
    this.setThreshold(0.6)
  }

  public setTexture(tex: WebGLTexture) {
    this.screenRect.tex = tex
  }

  public setGradientTexelSize(x: number, y: number) {
    this.shader.use()
    this.shader.setUniformFloat2('uGradientTexelSize', x, y)
  }

  private setTileSize(tileSize: number) {
    this.shader.use()
    this.shader.setUniformFloat('uTileSize', tileSize)
  }

  public setThreshold(threshold: number) {
    this.shader.use()
    this.shader.setUniformFloat('uThreshold', threshold)
  }
}
