import { ScreenRect } from '../model/screen'
import { Texture } from '../texture'
import { GenericModel } from '../model/model'
import { RenderingPass } from './pass'

export class ScreenPass extends RenderingPass {
  public render(models: GenericModel[]) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    super.render(models)
  }
}

export class ScreenTexturePass extends ScreenPass {
  protected screenRect: ScreenRect

  constructor(
    readonly texture: Texture = new Texture()
  ) {
    super()
    this.screenRect = new ScreenRect(texture)
  }

  render() {
    super.render([this.screenRect])
  }

  setTextureImage(source: TexImageSource) {
    this.texture.setTextureImage(source)
  }
}
