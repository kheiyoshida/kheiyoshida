import { BindingPoint, setUBOValue } from '../models/uniformBlock'
import { RenderUnit, Scene } from '../models'
import { positionToNDC } from './scale'
import { convertEyeValuesToMatrices } from './eye'
import { getGL } from '../webgl'
import { convertLightsToUboData } from './lights'
import { calcFaceNormalsOfBox } from './box'

const uPad = 0.0

export const renderScene = ({ eye, units, lights, unlitColor }: Scene) => {
  const gl = getGL()
  gl.clearColor(...unlitColor.normalizedRGB, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

  // scene-level uniform values
  const [view, projection] = convertEyeValuesToMatrices(eye)
  const uboData = new Float32Array([
    ...projection,
    ...view,
  ])
  setUBOValue(BindingPoint.Eye, uboData)

  const colorUboData = new Float32Array([...unlitColor.normalizedRGB, uPad])
  setUBOValue(BindingPoint.Color, colorUboData)

  // apply lights
  const lightsUBOData = convertLightsToUboData(lights, eye.position)

  setUBOValue(BindingPoint.Lights, lightsUBOData)

  units.forEach(renderUnit)
}

export const renderUnit = (unit: RenderUnit) => {
  const boxNormals = calcFaceNormalsOfBox(unit.box)

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

    ...boxNormals.normalTop, uPad,
    ...boxNormals.normalBottom, uPad,
    ...boxNormals.normalRight, uPad,
    ...boxNormals.normalLeft, uPad,
    ...boxNormals.normalFront, uPad,
    ...boxNormals.normalBack, uPad,
  ])
  setUBOValue(BindingPoint.DeformedBox, uboData)

  unit.meshes.forEach((mesh) => {
    mesh.render()
  })
}
