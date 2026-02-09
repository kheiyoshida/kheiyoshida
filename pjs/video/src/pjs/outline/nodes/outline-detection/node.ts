import { DrawTarget, RenderingNode, ScreenRect, Shader } from 'graph-gl'
import { PixelDataProviderNode } from '../../../../lib-node/channel/node'
import vert from './screen.vert?raw'
import feature from './outline.frag?raw'

export class OutlineDetectionNode extends PixelDataProviderNode {
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
  }

  public setInput(featureDetectionNode: RenderingNode<DrawTarget>) {
    this.screenRect.tex = featureDetectionNode.renderTarget!.frameBuffer.colorTexture.tex
    this.setFeaturePassTexelSize(1 / featureDetectionNode.renderTarget!.frameBuffer.width, 1 / featureDetectionNode.renderTarget!.frameBuffer.height)
  }

  private setFeaturePassTexelSize(x: number, y: number) {
    this.shader.use()
    this.shader.setUniformFloat2('uFeaturePassTexelSize', x, y)
  }

  private setTileSize(tileSize: number) {
    this.shader.use()
    this.shader.setUniformFloat('uTileSize', tileSize)
  }
}
