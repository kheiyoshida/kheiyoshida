import { Geometry } from 'p5'
import { TerrainRenderStyle, TextureParams } from '../../domain/translate'
import { RenderGrid } from '../../domain/translate/renderGrid/renderSpec'
import { LightColorManager } from './camera/light'
import { calculateGeometries } from './objects'
import { ScaffoldValues, createScaffold } from './objects/scaffold'
import { makeColorManager } from './color'
import { makeSkinManager } from './objects/texture/skin'
import { Colors } from './color/colors'

const SkinColorManager = makeColorManager(Colors.gray)

const SkinManager = makeSkinManager(SkinColorManager)

export const drawTerrain = (renderGrid: RenderGrid, values: ScaffoldValues, terrainStyle: TerrainRenderStyle): void => {
  const scaffold = createScaffold(values)
  const geos = calculateGeometries(renderGrid, scaffold, terrainStyle)
  drawGeometries(geos)
}

const drawGeometries = (geos: Geometry[]): void => {
  p.background(0)
  p.texture(SkinManager.current)
  geos.forEach((geo) => p.model(geo))
}

export const updateAesthetics = (texture: TextureParams) => {
  LightColorManager.changeDefaultColor()
  SkinColorManager.resolve(texture.color)
  SkinManager.renew(...texture.skin)
}
