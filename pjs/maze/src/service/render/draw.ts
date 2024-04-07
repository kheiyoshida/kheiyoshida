import { Geometry } from 'p5'
import { RenderGrid } from '../../domain/compose/renderSpec'
import { getPalette } from './color/palette'
import { ModelGrid, convertToModelGrid } from './model'
import { finalize } from './model/finalize'
import { convertModelGrid } from './model/modelToGeo'
import { Scaffold, createScaffold } from './scaffold'
import { ScaffoldParams } from '../../domain/stats'

export const drawTerrain = (renderGrid: RenderGrid, scaffoldParams: ScaffoldParams): void => {
  const modelGrid = convertToModelGrid(renderGrid)
  const scaffold = createScaffold(scaffoldParams)
  const geos = calculateGeometries(modelGrid, scaffold)
  drawGeometries(geos)
}

const calculateGeometries = (modelGrid: ModelGrid, scaffold: Scaffold): Geometry[] => {
  const coords = convertModelGrid(modelGrid, scaffold)
  return finalize(coords)
}

const drawGeometries = (geos: Geometry[]): void => {
  p.background(getPalette().fill)
  geos.forEach((geo) => p.model(geo))
}
