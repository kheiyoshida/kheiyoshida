import { RenderTarget } from '../target'
import { getGL } from '../../gl'

export abstract class RenderingNode<RT extends RenderTarget | undefined = undefined> {
  renderTarget?: RT = undefined
  public abstract render(): void
  public abstract validate(): void
}

export interface Drawable {
  draw(): void
}

export abstract class ModelRenderingNode<
  RT extends RenderTarget | undefined = undefined,
> extends RenderingNode<RT> {
  protected gl = getGL()
  public backgroundColor: [number, number, number, number] = [1, 1, 1, 1]

  protected _drawables: Drawable[] = []
  public get drawables() {
    return this._drawables
  }
  public set drawables(drawables: Drawable[]) {
    this._drawables = drawables
  }

  public render() {
    this.gl.clearColor(...this.backgroundColor)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT| this.gl.DEPTH_BUFFER_BIT)
    this.drawables.forEach((drawable) => drawable.draw())
  }
}
