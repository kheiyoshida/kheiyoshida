import { Material } from './material'
import { GeometrySpec } from './geometry'
import { parseGeometrySpecToArray } from './geometry/load'
import { getGL } from '../webgl'
import { mat4 } from 'gl-matrix'
import { GenericModel } from 'graph-gl'

export class MazeModel extends GenericModel {
  private gl: WebGL2RenderingContext = getGL()

  constructor(
    private material: Material,
    geometry: GeometrySpec
  ) {
    const dataArray = parseGeometrySpecToArray(geometry)
    super(
      material.shader,
      dataArray,
      [
        { name: 'aPosition', size: 3, stride: (3 + 3) * 4, offset: 0 },
        { name: 'aNormal', size: 3, stride: (3 + 3) * 4, offset: 3 * 4 },
      ],
      getGL().STATIC_DRAW
    )
  }

  drawAtTransform(modelMatrix: mat4) {
    this.material.apply()
    this.material.shader.setUniformMatrix4('model', modelMatrix)
    super.draw(this.gl.TRIANGLES)
  }
}
