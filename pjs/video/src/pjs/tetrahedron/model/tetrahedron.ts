import { getGL, Shader } from 'graph-gl'
import vert from './tetra.vert?raw'
import frag from './tetra.frag?raw'
import { GeometrySpec, parseObjData } from '../../../lib/model/parse'
import tetra from './tetrahedron.obj?raw'
import { Generic3DModel } from '../../../lib/model/model'
import { Tetrahedron } from './data'

export class TetraChain extends Generic3DModel {
  private tetrahedra: Tetrahedron[] = []

  constructor() {
    const geometry: GeometrySpec = parseObjData(tetra)
    const dataArray = new Float32Array(36 * 12 * 100)
    const shader = new Shader(vert, frag)
    super(shader, dataArray, [
      { name: 'aPosition', size: 3, stride: (3 + 3 + 3) * 4, offset: 0 },
      { name: 'aNormal', size: 3, stride: (3 + 3 + 3) * 4, offset: 3 * 4 },
      { name: 'aCenter', size: 3, stride: (3 + 3 + 3) * 4, offset: 6 * 4 },
    ])
    this.setModelMatrix()

    const tetraRoot = new Tetrahedron(geometry)
    this.tetrahedra = [tetraRoot]

    const extra = tetraRoot.extend(2)
    this.tetrahedra.push(extra)

    const arr = this.tetrahedra.flatMap(tet => tet.mapToArray())
    for(let i = 0; i < arr.length; i++) {
      this.dataArray[i] = arr[i]
    }
    this.updateData()
  }

  private updateData() {
    const gl = getGL()
    gl.bindVertexArray(this.vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    gl.bufferData(gl.ARRAY_BUFFER, this.dataArray, gl.STATIC_DRAW)
    gl.bindVertexArray(null)

    this.vertexCount = this.dataArray.length / ((3 + 3 + 3) * 4)
  }
}
