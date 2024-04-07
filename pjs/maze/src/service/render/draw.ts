import { Geometry } from 'p5'
import { RenderGrid } from '../../domain/compose/renderSpec'
import { getPalette } from './color/palette'
import { convertToModelGrid } from './model'
import { finalize } from './model/finalize'
import { convertModelGrid } from './model/modelToGeo'
import { createScaffold } from './scaffold'

export const drawTerrain = (renderGrid: RenderGrid): void => {
  const geos = calculateGeometries(renderGrid)
  drawGeometries(geos)
}

const calculateGeometries = (renderGrid: RenderGrid): Geometry[] => {
  const modelGrid = convertToModelGrid(renderGrid)
  const scaffold = createScaffold()
  const coords = convertModelGrid(modelGrid, scaffold)
  return finalize(coords)
}

const drawGeometries = (geos: Geometry[]): void => {
  p.background(getPalette().fill)
  geos.forEach((geo) => p.model(geo))
}
