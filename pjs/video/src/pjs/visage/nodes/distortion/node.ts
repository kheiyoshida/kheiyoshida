import { getGL, OffscreenDrawNode, ScreenRect, Shader } from 'graph-gl'
import vert from './screen.vert?raw'
import frag from './distortion.frag?raw'
import { FeatureScoringNode } from '../scoring/node'

export class DistortionNode extends OffscreenDrawNode {
  private readonly shader: Shader
  public readonly screenRect

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
    this.shader = new Shader(vert, frag)
    this.screenRect = new ScreenRect(this.shader)
    this.drawables.push(this.screenRect)
    this.tileSize = tileSize
  }

  public setResolution() {
    if (this.renderTarget === undefined) throw new Error('renderTarget is undefined')
    const x = this.renderTarget.frameBuffer.width
    const y = this.renderTarget.frameBuffer.height
    this.shader.use()
    this.shader.setUniformFloat2('uResolution', x, y)
  }

  public setInput(node: OffscreenDrawNode) {
    this.screenRect.tex = node.renderTarget!.frameBuffer.colorTexture.tex
  }

  public setScoreInput(node: FeatureScoringNode) {
    this.shader.use()
    this.shader.setUniformInt('uScoreTexture', 4)

    const gl = getGL()
    gl.activeTexture(gl.TEXTURE4)
    gl.bindTexture(gl.TEXTURE_2D, node.renderTarget!.frameBuffer.colorTexture.tex)
  }

  private setTileSize(tileSize: number) {
    this.shader.use()
    this.shader.setUniformFloat('uTileSize', tileSize)
  }

  override render() {
    this.shader.use()
    this.shader.setUniformFloat('uTime', performance.now() * 0.001)
    super.render()
  }
}
