import { Geometry } from 'p5'
import { TerrainRenderStyle } from '../../../domain/translate'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec'
import { Scaffold } from './scaffold'
import { convertToGeometrySpecList } from './finalise/dynamic/modelToCoords'
import { finalizeGeometries } from './finalise/dynamic/finalize'
import { convertToModelGrid } from './model/dynamic'

export const calculateGeometries = (
  renderGrid: RenderGrid,
  scaffold: Scaffold,
  terrainStyle: TerrainRenderStyle
): Geometry[] => {
  const modelGrid = convertToModelGrid(renderGrid, terrainStyle)
  const coords = convertToGeometrySpecList(modelGrid, scaffold)
  return finalizeGeometries(coords)
}
