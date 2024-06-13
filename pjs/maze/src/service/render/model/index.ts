import { Geometry } from 'p5'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec'
import { Scaffold } from '../scaffold'
import { finalizeGeometries } from './finalize/finalize'
import { convertToModelGrid } from './grid/modelGrid'
import { convertToGeometrySpecList } from './coords/modelToCoords'
import { TerrainRenderStyle } from '../../../domain/translate'

export const calculateGeometries = (renderGrid: RenderGrid, scaffold: Scaffold, terrainStyle: TerrainRenderStyle): Geometry[] => {
  const modelGrid = convertToModelGrid(renderGrid)
  const coords = convertToGeometrySpecList(modelGrid, scaffold)
  return finalizeGeometries(coords)
}
