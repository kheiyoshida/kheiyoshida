import { Geometry } from 'p5'
import { TerrainRenderStyle, TextureParams } from '../../../domain/translate'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec'
import { LightColorManager } from '../camera/light'
import { makeColorManager } from '../color'
import { Colors } from '../color/colors'
import { finalizeGeometries } from './finalise/dynamic/finalize'
import { convertToGeometrySpecList } from './finalise/dynamic/modelToCoords'
import { convertToModelGrid } from './model'
import { Scaffold, ScaffoldValues, createScaffold } from './scaffold'
import { makeSkinManager } from './texture/skin'

const SkinColorManager = makeColorManager(Colors.gray)

const SkinManager = makeSkinManager(SkinColorManager)

export const calculateGeometries = (
  renderGrid: RenderGrid,
  scaffold: Scaffold,
  terrainStyle: TerrainRenderStyle
): Geometry[] => {
  const modelGrid = convertToModelGrid(renderGrid, terrainStyle)
  const coords = convertToGeometrySpecList(modelGrid, scaffold)
  return finalizeGeometries(coords)
}

export const drawTerrain = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  terrainStyle: TerrainRenderStyle
): void => {
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
