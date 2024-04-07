import { Geometry } from 'p5'
import { RenderGrid } from '../../domain/compose/renderSpec'
import { getPalette } from './color/palette'
import { ModelGrid, convertToModelGrid } from './model'
import { finalize } from './model/finalize'
import { convertModelGrid } from './model/modelToGeo'
import { Scaffold, ScaffoldLengths, createScaffold } from './scaffold'

export const drawTerrain = (renderGrid: RenderGrid, lengths: ScaffoldLengths): void => {
  const modelGrid = convertToModelGrid(renderGrid)
  const scaffold = createScaffold(lengths)
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
