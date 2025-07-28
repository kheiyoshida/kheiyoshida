import { getGL } from '../gl'

export class Renderer {
  protected gl = getGL()
  constructor(protected program: WebGLProgram) {
    this.gl.useProgram(this.program)
  }

  use() {
    this.gl.useProgram(this.program)
  }
}
