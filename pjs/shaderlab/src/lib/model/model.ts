import { GenericModel, getGL, Shader } from 'graph-gl'
import { mat4, quat, vec3 } from 'gl-matrix'

import vert from './default.vert?raw'
import frag from './default.frag?raw'
import { GeometrySpec, loadFileContent, parseGeometrySpecToArray, parseObjData } from './parse.ts'

export class ModelBase extends GenericModel {
  constructor(geometry: GeometrySpec, shader = new Shader(vert, frag)) {
    const dataArray = parseGeometrySpecToArray(geometry)
    super(
      shader,
      dataArray,
      [
        { name: 'aPosition', size: 3, stride: (3 + 3) * 4, offset: 0 },
        { name: 'aNormal', size: 3, stride: (3 + 3) * 4, offset: 3 * 4 },
      ],
      getGL().STATIC_DRAW
    )
  }

  public static async buildFromPath(objFilePath: string) {
    const objFileContent = await loadFileContent(objFilePath)
    return this.build(objFileContent)
  }

  public static build(objFileContent: string) {
    const spec = parseObjData(objFileContent)
    return new ModelBase(spec)
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
}
