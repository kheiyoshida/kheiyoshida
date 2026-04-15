import { GeometrySpec, parseGeometrySpecToArray } from '../../lib/model/parse.ts'
import vert from './particle.vert?raw'
import frag from './particle.frag?raw'
import { getGL, InstancedModel, Shader } from 'graph-gl'
import { mat4, quat, vec3 } from 'gl-matrix'

export class ParticleModel extends InstancedModel {
  constructor(instanceGeometry: GeometrySpec, geometry: GeometrySpec, shader = new Shader(vert, frag)) {
    const numOfParticles = 300

    const instanceGeometryVertices = parseGeometrySpecToArray(instanceGeometry, false).map(v => v * 0.01)
    super(
      shader,
      instanceGeometryVertices,
      [{ name: 'aPosition', size: 3, stride: 3 * 4, offset: 0 }],
      [
        { name: 'aTriA', size: 3, stride: (3 + 3 + 3) * 4, offset: 0, divisor: 1 },
        { name: 'aTriB', size: 3, stride: (3 + 3 + 3) * 4, offset: 3 * 4, divisor: 1 },
        { name: 'aTriC', size: 3, stride: (3 + 3 + 3) * 4, offset: 6 * 4, divisor: 1 },
      ],
      geometry.faces.length * 3 * numOfParticles,
      getGL().STATIC_DRAW
    )

    this.setModelMatrix()

    // TODO: set the number of particles based on each triangle's area size

    let count = 0
    for (const tri of geometry.faces) {
      for (let i = 0; i < numOfParticles; i++) {
        for(let j = 0; j < 3; j++) {
          const v = geometry.vertices[tri.vertexIndices[j]]
          this.instanceDataArray[count * 9 + j * 3] = v[0]
          this.instanceDataArray[count * 9 + j * 3 + 1] = v[1]
          this.instanceDataArray[count * 9 + j * 3 + 2] = v[2]
        }
        count++
      }
    }

    this.updateInstances(count)
  }

  public override draw() {
    super.draw(getGL().TRIANGLES)
  }

  private _position: vec3 = vec3.fromValues(0, 0, 0)
  private _rotation: vec3 = vec3.fromValues(0, 0, 0)
  private _scale: vec3 = vec3.fromValues(1, 1, 1)

  public get position() {
    return this._position
  }
  public set position(pos: vec3) {
    this._position = pos
    this.setModelMatrix()
  }

  public get rotation() {
    return this._rotation
  }
  public set rotation(rot: vec3) {
    this._rotation = rot
    this.setModelMatrix()
  }

  public get scale() {
    return this._scale
  }
  public set scale(s: vec3) {
    this._scale = s
    this.setModelMatrix()
  }

  private setModelMatrix() {
    const matrix = mat4.create()

    const q = quat.create()
    quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2])

    mat4.fromRotationTranslationScale(matrix, q, this.position, this.scale)

    this.shader.use()
    this.shader.setUniformMatrix4('uModel', matrix)
  }

  public setViewMatrix(mat: mat4) {
    this.shader.use()
    this.shader.setUniformMatrix4('uView', mat)
  }

  public setProjectionMatrix(mat: mat4) {
    this.shader.use()
    this.shader.setUniformMatrix4('uProjection', mat)
  }

  public setTime(t: number) {
    this.shader.use()
    this.shader.setUniformFloat('uTime', t)
  }
}
