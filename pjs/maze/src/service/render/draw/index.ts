import { TerrainRenderStyle, TextureParams } from '../../../domain/translate'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec'
import { LightColorManager } from '../camera/light'
import { makeColorManager } from '../color'
import { Colors } from '../color/colors'
import { finaliseModelsAsDrawables } from './finalise'
import { DrawableObject } from './finalise/types'
import { convertToModelGrid } from './model'
import { ScaffoldValues, createScaffold } from './scaffold'
import { makeSkinManager } from './texture/skin'

const SkinColorManager = makeColorManager(Colors.gray)

const SkinManager = makeSkinManager(SkinColorManager)

export const drawTerrain = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  terrainStyle: TerrainRenderStyle
): void => {
  const scaffold = createScaffold(values)
  const modelGrid = convertToModelGrid(renderGrid, terrainStyle)
  const drawables = finaliseModelsAsDrawables(modelGrid, scaffold)
  drawGeometries(drawables)
}

const drawGeometries = (drawables: DrawableObject[]): void => {
  p.background(0)
  p.texture(SkinManager.current)
  drawables.forEach((obj) => {
    p.model(obj.geometry)
  })
}

export const updateAesthetics = (texture: TextureParams) => {
  LightColorManager.changeDefaultColor()
  SkinColorManager.resolve(texture.color)
  SkinManager.renew(...texture.skin)
}
