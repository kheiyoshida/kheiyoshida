import { Shader } from '../../gl/shader'
import { Texture2dModel } from '../../gl/model/screen'
import { GenericModel } from '../../gl/model/model'
import { OffScreenPass } from '../../gl/pass/offscreen'
import { FrameBuffer } from '../../gl/frameBuffer'

export type EffectFactory = (input: FrameBuffer, output: FrameBuffer) => PostEffect

export abstract class PostEffect {
  public offScreenPass: OffScreenPass
  public models: GenericModel[] = []

  protected constructor() {
    this.offScreenPass = new OffScreenPass()
  }

  public render() {
    this.offScreenPass.render(this.models)
  }

  public abstract setInput(inputFrameBuffer: FrameBuffer): void
}

export class PostScreenEffect extends PostEffect {
  private readonly rect: FrameBufferTextureRect

  public constructor(screenShader: Shader) {
    super()
    this.rect = new FrameBufferTextureRect(screenShader)
    this.models.push(this.rect)
  }

  public setInput(inputFrameBuffer: FrameBuffer) {
    this.rect.tex = inputFrameBuffer.tex
  }

  public static makeFactory(vert: string, frag: string): EffectFactory {
    return (input, output) => new PostScreenEffect(new Shader(vert, frag))
  }
}


/**
 * screen rect to render frame buffer.
 * note that UVs are inverted
 */
export class FrameBufferTextureRect extends Texture2dModel {
  constructor(screenShader: Shader, tex?: WebGLTexture) {
    // prettier-ignore
    const screenRectVertices = new Float32Array([
      -1, -1, 0, 0,
      1, -1,  1, 0,
      -1, 1,  0, 1,
      1, 1,   1, 1
    ])
    super(screenShader, screenRectVertices, tex)
  }
}
