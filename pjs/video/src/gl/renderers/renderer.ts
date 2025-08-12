import { GenericModel } from '../model/model'
import { getGL } from '../gl'

export abstract class Renderer {
  protected gl = getGL()

  public render(models: GenericModel[]) {
    this.gl.clearColor(...this.backgroundColor)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    models.forEach((model) => {
      model.draw()
    })
  }

  public backgroundColor: [number, number, number, number] = [1, 1, 1, 1]
}

export class ScreenRenderer extends Renderer {
  public render(models: GenericModel[]) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    super.render(models)
  }
}
