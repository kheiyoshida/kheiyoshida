import { Geometry } from 'p5'
import { ColorOperationParams } from '../../domain/translate/color/types'
import { RenderGrid } from '../../domain/translate/renderGrid/renderSpec'
import { LightColorManager } from './camera/light'
import { calculateGeometries } from './model'
import { ScaffoldValues, createScaffold } from './scaffold'
import { SkinColorManager, SkinManager } from './texture'

export const drawTerrain = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  color: ColorOperationParams
): void => {
  const scaffold = createScaffold(values)
  const geos = calculateGeometries(renderGrid, scaffold)
  SkinColorManager.resolve(color)
  drawGeometries(geos)
}

const drawGeometries = (geos: Geometry[]): void => {
  p.background(0)
  // p.fill(SkinColorManager.current)
  // SkinManager.renew()
  p.texture(SkinManager.current)
  geos.forEach((geo) => p.model(geo))
}

export const updateAesthetics = (floor: number) => {
  // if (floor % 5 !== 0) return
  LightColorManager.changeDefaultColor()
  SkinColorManager.changeDefaultColor()
  SkinManager.renew()
}
