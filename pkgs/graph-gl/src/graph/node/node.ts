import { RenderTarget } from '../target'
import { GenericModel } from '../../model/model'
import { getGL } from '../../gl/gl'

export abstract class RenderingNode<RT extends RenderTarget | undefined = undefined> {
  renderTarget?: RT = undefined
  abstract render(): void
}

export abstract class ModelRenderingNode<RT extends RenderTarget | undefined = undefined> extends RenderingNode<RT> {
  protected gl = getGL()
  public backgroundColor: [number, number, number, number] = [1, 1, 1, 1]
  protected models: GenericModel[] = []

  public render() {
    this.gl.clearColor(...this.backgroundColor)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.models.forEach((model) => model.draw())
  }
}
