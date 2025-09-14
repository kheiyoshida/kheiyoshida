import { Shader } from '../../gl/shader'
import { Texture2dModel } from '../../gl/model/screen'
import { GenericModel } from '../../gl/model/model'
import { OffScreenPass } from '../../gl/pass/offscreen'
import { FrameBuffer } from '../../gl/frameBuffer'

export type EffectFactory = (input: FrameBuffer, output: FrameBuffer) => PostEffect

export class PostEffect {
  public offScreenPass: OffScreenPass
  public models: GenericModel[] = []

  public constructor(
    inputFrameBuffer: FrameBuffer,
    outputFrameBuffer: FrameBuffer,
    screenShader: Shader
  ) {
    this.offScreenPass = new OffScreenPass(outputFrameBuffer)
    this.models.push(
      new FrameBufferTextureRect(inputFrameBuffer.tex, screenShader)
    )
  }

  public static makeFactory(vert: string, frag: string): EffectFactory {
    return (input, output) => new PostEffect(input, output, new Shader(vert, frag))
  }

  public render() {
    this.offScreenPass.render(this.models)
  }
}


/**
 * screen rect to render frame buffer.
 * note that UVs are inverted
 */
export class FrameBufferTextureRect extends Texture2dModel {
  constructor(tex: WebGLTexture, screenShader: Shader) {
    // prettier-ignore
    const screenRectVertices = new Float32Array([
      -1, -1, 0, 0,
      1, -1,  1, 0,
      -1, 1,  0, 1,
      1, 1,   1, 1
    ])
    super(tex, screenShader, screenRectVertices)
  }
}
