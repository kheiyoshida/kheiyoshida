import { DrawTarget, RenderingNode, ScreenRect, Shader } from 'graph-gl'
import { PixelDataProviderNode } from '../../../../lib-node/channel/node'
import vert from './screen.vert?raw'
import feature from './feature.frag?raw'

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

  public setInput(node: RenderingNode<DrawTarget>) {
    this.screenRect.tex = node.renderTarget!.frameBuffer.colorTexture.tex
    this.setGradientTexelSize(1 / node.renderTarget!.frameBuffer.width, 1 / node.renderTarget!.frameBuffer.height)
  }

  private setGradientTexelSize(x: number, y: number) {
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
