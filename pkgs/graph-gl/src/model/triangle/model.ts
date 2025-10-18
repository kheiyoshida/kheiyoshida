import vert from './triangle.vert?raw'
import frag from './triangle.frag?raw'
import { GenericModel } from '../model'
import { Shader } from '../../gl'

export class TriangleModel extends GenericModel {
  constructor() {
    const shader = new Shader(vert, frag)
    // prettier-ignore
    const vertices = new Float32Array([
      -0.5, -0.5,
      0.5, -0.5,
      0, 0.5
    ])

    super(shader, vertices, [
      {
        name: 'aPos',
        size: 2,
        stride: 0,
        offset: 0,
      },
    ])

    this.shader.use()
  }
}

export class DebugTriangleModel extends GenericModel {
  constructor() {
    const vert = `#version 300 es
in vec2 pos;
void main() {
  gl_Position = vec4(pos, 0.0, 1.0);
}`
    const frag = `#version 300 es
precision mediump float;
out vec4 fragColor;
uniform vec4 uColor;
void main() {
  fragColor = uColor;
}`
    const shader = new Shader(vert, frag)

    // prettier-ignore
    const vertices = new Float32Array([
      -1, -1, 3, -1, -1, 3, // oversize tri
    ])

    super(shader, vertices, [
      {
        name: 'pos',
        size: 2,
        stride: 0,
        offset: 0,
      }
    ])
  }

  public setColor(color: [number, number, number, number]) {
    this.shader.use()
    this.shader.setUniform4fv('uColor', color)
  }
}
