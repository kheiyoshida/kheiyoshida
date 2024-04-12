import { Geometry } from 'p5'
import { ColorIntention } from '../../domain/color/types'
import { RenderGrid } from '../../domain/compose/renderSpec'
import { resolveColorIntention } from './color'
import { ModelGrid, convertToModelGrid } from './model'
import { finalize } from './model/finalize'
import { convertModelGrid } from './model/modelToGeo'
import { Scaffold, ScaffoldValues, createScaffold } from './scaffold'

export const drawTerrain = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  color: ColorIntention
): void => {
  const modelGrid = convertToModelGrid(renderGrid)
  const scaffold = createScaffold(values)
  const geos = calculateGeometries(modelGrid, scaffold)
  paint(color)
  drawGeometries(geos)
}

const calculateGeometries = (modelGrid: ModelGrid, scaffold: Scaffold): Geometry[] => {
  const coords = convertModelGrid(modelGrid, scaffold)
  return finalize(coords)
}

const paint = (color: ColorIntention) => {
  resolveColorIntention(color)
}

const drawGeometries = (geos: Geometry[]): void => {
  geos.forEach((geo) => p.model(geo))
}
