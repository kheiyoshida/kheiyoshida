import { ObjectDrawParams, TerrainRenderStyle, TextureParams } from '../../../domain/translate'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec'
import { LightColorManager } from '../camera/light'
import { makeColorManager } from '../color'
import { Colors } from '../color/colors'
import { finaliseModelsAsDrawables } from './finalise'
import { DrawableObject } from './finalise/types'
import { convertToModelGrid } from '../unit'
import { createScaffold, ScaffoldValues } from '../scaffold'

const SkinColorManager = makeColorManager(Colors.gray)

export const drawTerrain = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  terrainStyle: TerrainRenderStyle,
  { alignment }: ObjectDrawParams
): void => {
  // const scaffold = createScaffold(values)
  // const modelGrid = convertToModelGrid(renderGrid, terrainStyle)
  // const drawables = finaliseModelsAsDrawables(modelGrid, scaffold, alignment)
  // drawGeometries(drawables)
}

const drawGeometries = (drawables: DrawableObject[]): void => {
  p.background(0)
  drawables.forEach((obj) => {
    p.push()
    p.translate(...obj.position)
    if (obj.rotation) {
      p.rotateY(obj.rotation.theta)
      p.rotateX(obj.rotation.phi)
    }
    p.model(obj.geometry)
    p.pop()
  })
}

export const updateAesthetics = (texture: TextureParams) => {
  LightColorManager.changeDefaultColor()
  SkinColorManager.resolve(texture.color)
}
