import { Geometry } from 'p5'
import { TerrainRenderStyle } from '../../../domain/translate'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec'
import { Scaffold } from '../scaffold'
import { convertToGeometrySpecList } from './coords/modelToCoords'
import { finalizeGeometries } from './finalize/finalize'
import { convertToModelGrid } from './grid'

export const calculateGeometries = (
  renderGrid: RenderGrid,
  scaffold: Scaffold,
  terrainStyle: TerrainRenderStyle
): Geometry[] => {
  const modelGrid = convertToModelGrid(renderGrid, terrainStyle)
  const coords = convertToGeometrySpecList(modelGrid, scaffold)
  return finalizeGeometries(coords)
}
