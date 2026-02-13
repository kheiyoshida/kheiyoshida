import { DrawRTHandle, FrameBuffer, getGL, ImageResolution, OffscreenDrawNode, Shader, TextureUnit } from 'graph-gl'
import { IEffectModel, ScreenEffectModel } from '../../../../lib-node/effect/node'
import screenVert from '../../../../lib-node/effect/shaders/screen.vert?raw'
import screenFrag from '../../../../lib-node/effect/shaders/screen.frag?raw'
import afterimage from './afterimage.frag?raw'
import afterimageVert from './afterimage.vert?raw'

export class AfterImageNode extends OffscreenDrawNode {
  public readonly afterImageFx: AfterImageEffect
  public readonly historyRT: DrawRTHandle

  protected readonly inputThru: IEffectModel
  protected readonly resultCopy: IEffectModel

  constructor(resolution: ImageResolution) {
    super()
    this.historyRT = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height))

    this.inputThru = new ScreenEffectModel(new Shader(screenVert, afterimage))

    this.afterImageFx = new AfterImageEffect()

    this.resultCopy = new ScreenEffectModel(new Shader(screenVert, screenFrag))
  }

  setInput(node: OffscreenDrawNode) {
    const inputFrameBuffer = node.renderTarget!.frameBuffer
    this.inputThru.setInput(inputFrameBuffer)

    this.afterImageFx.setInput(inputFrameBuffer)
    this.afterImageFx.setHistoryInput(this.historyRT.frameBuffer)

    if (!this.renderTarget) throw new Error('specify renderTarget first')
    this.resultCopy.setInput(this.renderTarget!.frameBuffer)
  }

  get drawables() {
    if (this.enabled) return [this.afterImageFx]
    else return [this.inputThru]
  }

  override render() {
    // render onto screen, combined
    super.render()

    // save result onto history
    if (this.enabled) {
      this.historyRT.frameBuffer.activate()
      this.gl.clearColor(...this.backgroundColor)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT| this.gl.DEPTH_BUFFER_BIT)
      this.resultCopy.draw()
      this.historyRT.frameBuffer.deactivate()
    }
  }

  public get enabled() {
    return this.afterImageFx.amount !== 0
  }
}

export class AfterImageEffect extends ScreenEffectModel {
  constructor() {
    super(new Shader(afterimageVert, afterimage))

    this.shader.use()
    this.shader.setUniformInt('uHistoryTexture', TextureUnit.Extra)
  }

  private historyTexture?: WebGLTexture

  public setHistoryInput(frameBuffer: FrameBuffer) {
    this.historyTexture= frameBuffer.colorTexture.tex
  }

  override draw() {
    const gl = getGL()
    gl.activeTexture(gl.TEXTURE3) // extra texture unit
    gl.bindTexture(gl.TEXTURE_2D, this.historyTexture!)
    super.draw()
  }

  public amount: number = 0
  public setAmount(a: number) {
    this.amount = a
    this.shader.use()
    this.shader.setUniformFloat('uAmount', this.amount)
  }
}
