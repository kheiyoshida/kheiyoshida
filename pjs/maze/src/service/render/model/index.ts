import { Geometry } from 'p5'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec'
import { Scaffold } from '../scaffold'
import { finalize } from './finalize/finalize'
import { convertToModelGrid } from './grid/modelGrid'
import { convertToCoords } from './coords/modelToCoords'

export const calculateGeometries = (renderGrid: RenderGrid, scaffold: Scaffold): Geometry[] => {
  const modelGrid = convertToModelGrid(renderGrid)
  const coords = convertToCoords(modelGrid, scaffold)
  return finalize(coords)
}
