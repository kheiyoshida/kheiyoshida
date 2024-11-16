import { BindingPoint, setUBOValue } from '../models/uniformBlock'
import { RenderUnit, Scene } from '../models'
import { positionToNDC } from './scale'
import { convertEyeValuesToMatrices } from './eye'

const uPad = 0.0

export const renderScene = ({ eye, units }: Scene) => {

  // scene-level uniform values
  const [view, projection] = convertEyeValuesToMatrices(eye)
  const uboData = new Float32Array([...projection, ...view])
  setUBOValue(BindingPoint.Eye, uboData)

  units.forEach(renderUnit)
}

export const renderUnit = (unit: RenderUnit) => {

  // unit-level uniform values
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
