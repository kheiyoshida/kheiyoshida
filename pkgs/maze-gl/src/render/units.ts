import { OffscreenDrawNode } from 'graph-gl'
import { convertEyeValuesToMatrices } from './eye'
import { BindingPoint, setUBOValue } from '../models/uniformBlock'
import { convertLightsToUboData } from './lights'

import { RenderUnit, Scene } from '../models'
import { calcFaceNormalsOfBox } from './box'
import { positionToNDC } from './scale'

const uPad = 0.0

export class UnitsRenderingNode extends OffscreenDrawNode {
  private scene!: Scene

  public updateScene(scene: Scene) {
    this.scene = scene
  }

  public override render() {
    // super.render()

    // TODO: refactor this
    this.renderTarget!.frameBuffer.activate()

    this.gl.depthMask(true)

    const { eye, units, lights, unlitColor, effect } = this.scene

    this.gl.clearColor(...unlitColor.normalizedRGB, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    // scene-level uniform values
    const [view, projection] = convertEyeValuesToMatrices(eye)
    const uboData = new Float32Array([...projection, ...view])
    setUBOValue(BindingPoint.Eye, uboData)

    const colorUboData = new Float32Array([...unlitColor.normalizedRGB, uPad])
    setUBOValue(BindingPoint.Color, colorUboData)

    // apply lights
    const lightsUBOData = convertLightsToUboData(lights, eye.position)
    setUBOValue(BindingPoint.Lights, lightsUBOData)

    // apply effects
    setUBOValue(BindingPoint.Effect, new Float32Array([effect.fogLevel, uPad, uPad, uPad]))

    units.forEach(renderUnit)

    this.renderTarget!.frameBuffer.deactivate()
  }
}

const renderUnit = (unit: RenderUnit) => {
  const boxNormals = calcFaceNormalsOfBox(unit.box)

  // unit-level uniform values
  // prettier-ignore
  const uboData = new Float32Array([
    ...positionToNDC(unit.box.FBL), uPad,
    ...positionToNDC(unit.box.FBR), uPad,
    ...positionToNDC(unit.box.FTL), uPad,
    ...positionToNDC(unit.box.FTR), uPad,
    ...positionToNDC(unit.box.BBL), uPad,
    ...positionToNDC(unit.box.BBR), uPad,
    ...positionToNDC(unit.box.BTL), uPad,
    ...positionToNDC(unit.box.BTR), uPad,

    // TODO: do we still need this?
    ...boxNormals.normalTop, uPad,
    ...boxNormals.normalBottom, uPad,
    ...boxNormals.normalRight, uPad,
    ...boxNormals.normalLeft, uPad,
    ...boxNormals.normalFront, uPad,
    ...boxNormals.normalBack, uPad,
  ])
  setUBOValue(BindingPoint.DeformedBox, uboData)

  unit.objects.forEach((object) => {
    object.draw()
  })
}
