import { Geometry } from 'p5'
import { ColorOperationParams } from '../../domain/translate/color/types'
import { RenderGrid } from '../../domain/translate/renderGrid/renderSpec'
import { createColorManager } from './color'
import { calculateGeometries } from './model'
import { ScaffoldValues, createScaffold } from './scaffold'

const ColorManager = createColorManager()

export const drawTerrain = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  color: ColorOperationParams
): void => {
  const scaffold = createScaffold(values)
  const geos = calculateGeometries(renderGrid, scaffold)
  ColorManager.resolve(color)
  drawGeometries(geos)
}

export const triggerFadeOut = (frames: number) =>
  ColorManager.setFixedOperation(['fadeout', frames], frames)

const drawGeometries = (geos: Geometry[]): void => {
  geos.forEach((geo) => p.model(geo))
}
