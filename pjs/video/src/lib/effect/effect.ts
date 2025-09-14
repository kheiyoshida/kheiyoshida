import { Shader } from '../../gl/shader'
import { Texture2dModel } from '../../gl/model/screen'
import { GenericModel } from '../../gl/model/model'
import { OffScreenPass } from '../../gl/pass/offscreen'
import { FrameBuffer } from '../../gl/frameBuffer'

export type EffectFactory = (input: FrameBuffer, output: FrameBuffer) => PostEffect

export abstract class PostEffect {
  public offScreenPass: OffScreenPass
  public models: GenericModel[] = []

  protected constructor(outputFrameBuffer: FrameBuffer) {
    this.offScreenPass = new OffScreenPass(outputFrameBuffer)
  }

  public render() {
    this.offScreenPass.render(this.models)
  }
}

export class PostScreenEffect extends PostEffect {
  public constructor(
    inputFrameBuffer: FrameBuffer,
    outputFrameBuffer: FrameBuffer,
    screenShader: Shader
  ) {
    super(outputFrameBuffer)
    this.models.push(
      new FrameBufferTextureRect(inputFrameBuffer.tex, screenShader)
    )
  }

  public static makeFactory(vert: string, frag: string): EffectFactory {
    return (input, output) => new PostScreenEffect(input, output, new Shader(vert, frag))
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
