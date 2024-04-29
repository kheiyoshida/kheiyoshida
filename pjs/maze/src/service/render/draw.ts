import { Geometry } from 'p5'
import { ColorOperationParams } from '../../domain/translate/color/types'
import { RenderGrid } from '../../domain/translate/renderGrid/renderSpec'
import { calculateGeometries } from './model'
import { ScaffoldValues, createScaffold } from './scaffold'
import { SkinColorManager } from './texture'

export const triggerFadeOut = (frames: number) => {
  // ColorManager.setFixedOperation(['fadeout', frames], frames)
}

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
  p.fill(SkinColorManager.current)
  // p.texture(getSkin())
  geos.forEach((geo) => p.model(geo))
}
