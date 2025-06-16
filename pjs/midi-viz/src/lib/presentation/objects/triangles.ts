import * as T from 'three'
import { ChainablePoint } from '../point.ts'
import { defaultScene } from '../setup.ts'

export class TriangleChain {
  protected readonly geometry: T.BufferGeometry
  public readonly points: ChainablePoint[]
  protected readonly positions: Float32Array
  protected readonly indices: Uint16Array

  constructor(points: ChainablePoint[], material?: T.Material) {
    if (points.length < 3) throw new Error('3 points required')

    this.points = points

    for (let i = 0; i < this.points.length - 1; i++) {
      this.points[i].connect(this.points[i + 1])
    }

    this.geometry = new T.BufferGeometry()

    // initialise vertices
    this.positions = new Float32Array(points.length * 3) // 3 floats per point

    this.geometry.setAttribute('position', new T.BufferAttribute(this.positions, 3))
    this.updateAttribPositions()

    //
    const numOfTriangles = points.length - 2

    this.indices = new Uint16Array(numOfTriangles * 3)
    for (let i = 0; i < numOfTriangles; i++) {
      this.indices[i * 3] = i
      this.indices[i * 3 + 1] = i + 1
      this.indices[i * 3 + 2] = i + 2
    }

    this.geometry.setIndex(new T.BufferAttribute(this.indices, 1))

    // uvs
    // const uvs = new Float32Array(points.length * 2)
    // for(let i = 0; i < numOfTriangles; i++) {
    //   uvs[i * 6] = 0
    //   uvs[i * 6 + 1] = 0
    //   uvs[i * 6 + 2] = 1
    //   uvs[i * 6 + 3] = 0
    //   uvs[i * 6 + 4] = 1
    //   uvs[i * 6 + 5] = 1
    // }
    // this.geometry.setAttribute('uv', new T.BufferAttribute(uvs, 2))

    this.geometry.computeVertexNormals()

    defaultScene().add(new T.Mesh(this.geometry, material))
  }

  /**
   * update buffer's vertex positions based on current moving points' position
   */
  public updateAttribPositions() {
    const positions = this.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i]

      positions[i * 3] = point.position.x
      positions[i * 3 + 1] = point.position.y
      positions[i * 3 + 2] = point.position.z
    }
    this.geometry.computeVertexNormals()
    this.geometry.attributes.position.needsUpdate = true
  }

  public update() {
    this.updateAttribPositions()
  }

  connect(other: TriangleChain) {
    this.points[0].connect(other.points[0])
    this.neighbours.push(other)
    other.neighbours.push(this)
  }

  neighbours: TriangleChain[] = []
}
