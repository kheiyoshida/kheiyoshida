import { mat4, vec3, vec4 } from 'gl-matrix'
import { BindingPoint, setUBOValue } from '../models/uniformBlock'
import { RenderUnit, Scene } from '../models'
import { getGL } from '../webgl'
import { positionToNDC } from './scale'

const uPad = 0.0

export const renderScene = ({ eye, units }: Scene) => {
  const gl = getGL()

  // get view matrix
  const view = mat4.create()
  const position = vec3.fromValues(...eye.position)
  const direction = vec3.fromValues(...eye.direction)
  const lookAtTarget = vec3.create()
  vec3.add(lookAtTarget, position, direction)
  const up = vec3.fromValues(0, 1, 0)
  mat4.lookAt(view, position, lookAtTarget, up)

  // get projection matrix
  const projection = mat4.create()
  mat4.perspective(projection, eye.fov, gl.canvas.width / gl.canvas.height, 0.1, eye.sight)

  const uboData = new Float32Array([...projection, ...view])
  setUBOValue(BindingPoint.Eye, uboData)

  units.forEach(renderUnit)
}

export const renderUnit = (unit: RenderUnit) => {
  const uboData = new Float32Array([
    ...positionToNDC(unit.box.FBL), uPad,
    ...positionToNDC(unit.box.FBR), uPad,
    ...positionToNDC(unit.box.FTL), uPad,
    ...positionToNDC(unit.box.FTR), uPad,
    ...positionToNDC(unit.box.BBL), uPad,
    ...positionToNDC(unit.box.BBR), uPad,
    ...positionToNDC(unit.box.BTL), uPad,
    ...positionToNDC(unit.box.BTR), uPad,
  ])
  setUBOValue(BindingPoint.DeformedBox, uboData)

  unit.meshes.forEach((mesh) => {
    mesh.render()
  })
}
