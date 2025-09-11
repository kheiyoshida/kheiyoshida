import { Shader } from '../../gl/shader'
import { ScreenPass } from '../../gl/pass/onscreen'
import screenVert from '../../gl/shaders/screen.vert?raw'
import screenFrag2 from '../../gl/shaders/monotone.frag?raw'
import { Texture2dModel } from '../../gl/model/screen'
import { GenericModel } from '../../gl/model/model'

export abstract class PostEffect {
  public screenPass: ScreenPass = new ScreenPass()
  public models: GenericModel[] = []

  protected constructor(readonly tex: WebGLTexture) {}

  public render() {
    this.screenPass.render(this.models)
  }
}

export class PostScreenEffect extends PostEffect {
  public screenPass: ScreenPass = new ScreenPass()

  constructor(tex: WebGLTexture, screenShader: Shader = new Shader(screenVert, screenFrag2)) {
    super(tex)
    this.models.push(new FrameBufferTextureRect(tex, screenShader))
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
