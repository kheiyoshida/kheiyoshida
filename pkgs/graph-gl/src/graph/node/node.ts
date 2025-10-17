import { RenderTarget } from '../target'
import { getGL } from '../../gl'

export abstract class RenderingNode<RT extends RenderTarget | undefined = undefined> {
  renderTarget?: RT = undefined
  abstract render(): void
}

export interface Drawable {
  draw(): void
}

export abstract class ModelRenderingNode<
  RT extends RenderTarget | undefined = undefined,
> extends RenderingNode<RT> {
  protected gl = getGL()
  public backgroundColor: [number, number, number, number] = [1, 1, 1, 1]
  public models: Drawable[] = []

  public render() {
    this.gl.clearColor(...this.backgroundColor)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.models.forEach((model) => model.draw())
  }
}
