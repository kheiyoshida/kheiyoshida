import { GenericModel } from './model'
import { Shader } from '../shader'
import screenVert from '../shaders/screen.vert?raw'
import screenFrag from '../shaders/screen.frag?raw'
import { Texture } from '../texture'

/**
 * screen rect that renders texture input
 */
export class ScreenRect extends GenericModel {
  constructor(texture: Texture) {
    const screenShader = new Shader(screenVert, screenFrag)
    // prettier-ignore
    const screenRectVertices = new Float32Array([
      -1, -1, 0, 1,
      1, -1, 1, 1,
      -1, 1, 0, 0,
      1, 1, 1, 0
    ])
    super(screenShader, screenRectVertices, [
      { name: 'aPos', size: 2, stride: 16, offset: 0 },
      { name: 'aUV', size: 2, stride: 16, offset: 8 },
    ])

    this.setTexture(texture)
  }

  public setTexture(texture: Texture) {
    this.shader.use()
    this.shader.setUniformInt('uTexture', texture.id)
  }
}

