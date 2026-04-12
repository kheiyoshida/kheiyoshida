import { Drawable, getGL, Shader } from 'graph-gl'
import vert from './tetra.vert?raw'
import frag from './tetra.frag?raw'
import { GeometrySpec, parseObjData } from '../../../lib/model/parse'
import tetra from './tetrahedron.obj?raw'
import { Generic3DModel } from '../../../lib/model/model'
import { Tetrahedron } from './data'
import { mat4 } from 'gl-matrix'

const stride = (3 + 3 + 3) * 4

export class TetraChain extends Generic3DModel {
  private tetrahedra: Tetrahedron[] = []

  constructor(shader = new Shader(vert, frag)) {
    const geometry: GeometrySpec = parseObjData(tetra)
    const dataArray = new Float32Array(36 * 12 * 100)
    super(shader, dataArray, [
      { name: 'aPosition', size: 3, stride: stride, offset: 0 },
      { name: 'aNormal', size: 3, stride: stride, offset: 3 * 4 },
      { name: 'aCenter', size: 3, stride: stride, offset: 6 * 4 },
    ])
    this.setModelMatrix()

    const tetraRoot = new Tetrahedron(geometry)
    this.tetrahedra = [tetraRoot]
    this.updateTetra(0, tetraRoot)

    this.uploadData()
  }

  public setScale(s: number) {
    this.shader.use()
    this.shader.setUniformFloat('uTetraScale', s)
  }

  public setLength(l: number) {
    if (l < 1) return

    if (l > this.tetrahedra.length) {
      this.extend(l - this.tetrahedra.length)
    } else if (l == this.tetrahedra.length) {
      return
    } else {
      this.shrink(this.tetrahedra.length - l)
    }
  }

  public extend(l: number) {
    for (let i = 0; i < l; i++) {
      const last = this.tetrahedra[this.tetrahedra.length - 1]
      const ex = last.extend()
      this.tetrahedra.push(ex)
      this.updateTetra(this.tetrahedra.length - 1, ex)
    }

    this.uploadData()
  }

  public shrink(l: number) {
    for (let i = 0; i < l; i++) {
      this.tetrahedra.pop()
    }

    this.uploadData()
  }

  private updateTetra(tetIndex: number, tetrahedron: Tetrahedron) {
    const offset = tetIndex * 9 * 4 * 3
    const tetData = tetrahedron.mapToArray()
    for (let i = 0; i < tetData.length; i++) {
      this.dataArray[offset + i] = tetData[i]
    }
  }

  private uploadData() {
    const gl = getGL()
    gl.bindVertexArray(this.vao)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.dataArray)
    gl.bindVertexArray(null)

    this.vertexCount = this.tetrahedra.length * 12
  }
}

export class TetraGraph implements Drawable {
  private chains: TetraChain[] = []
  constructor(chains: number) {
    const shader = new Shader(vert, frag)
    for (let i = 0; i < chains; i++) {
      this.chains.push(new TetraChain(shader))
    }
  }

  public setScale(s: number) {
    for (let i = 0; i < this.chains.length; i++) {
      this.chains[i].setScale(s)
    }
  }

  public setLength(l: number) {
    for (let i = 0; i < this.chains.length; i++) {
      this.chains[i].setLength(l)
    }
  }

  public set position(v: [number, number, number]) {
    for (let i = 0; i < this.chains.length; i++) {
      this.chains[i].position = v
    }
  }

  public setProjectionMatrix(m: mat4) {
    for (let i = 0; i < this.chains.length; i++) {
      this.chains[i].setProjectionMatrix(m)
    }
  }

  public setViewMatrix(m: mat4) {
    for (let i = 0; i < this.chains.length; i++) {
      this.chains[i].setViewMatrix(m)
    }
  }

  draw(): void {
    for (let i = 0; i < this.chains.length; i++) {
      this.chains[i].draw()
    }
  }
}
