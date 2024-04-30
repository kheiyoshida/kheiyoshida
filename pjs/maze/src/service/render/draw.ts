import { Geometry } from 'p5'
import { TextureParams } from '../../domain/translate'
import { RenderGrid } from '../../domain/translate/renderGrid/renderSpec'
import { LightColorManager } from './camera/light'
import { calculateGeometries } from './model'
import { ScaffoldValues, createScaffold } from './scaffold'
import { SkinColorManager, SkinManager } from './texture'

export const drawTerrain = (renderGrid: RenderGrid, values: ScaffoldValues): void => {
  const scaffold = createScaffold(values)
  const geos = calculateGeometries(renderGrid, scaffold)
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
