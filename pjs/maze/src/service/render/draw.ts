import { Geometry } from 'p5'
import { ColorOperationParams } from '../../domain/translate/color/types'
import { RenderGrid } from '../../domain/translate/renderGrid/renderSpec'
import { createColorManager } from './color'
import { ModelGrid, convertToModelGrid } from './model'
import { finalize } from './model/finalize'
import { convertModelGrid } from './model/modelToGeo'
import { Scaffold, ScaffoldValues, createScaffold } from './scaffold'

const ColorManager = createColorManager()

export const drawTerrain = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  color: ColorOperationParams
): void => {
  const modelGrid = convertToModelGrid(renderGrid)
  const scaffold = createScaffold(values)
  const geos = calculateGeometries(modelGrid, scaffold)
  ColorManager.resolve(color)
  drawGeometries(geos)
}

const calculateGeometries = (modelGrid: ModelGrid, scaffold: Scaffold): Geometry[] => {
  const coords = convertModelGrid(modelGrid, scaffold)
  return finalize(coords)
}

export const triggerFadeOut = (frames: number) =>
  ColorManager.setFixedOperation(['fadeout', frames], frames)

const drawGeometries = (geos: Geometry[]): void => {
  geos.forEach((geo) => p.model(geo))
}
