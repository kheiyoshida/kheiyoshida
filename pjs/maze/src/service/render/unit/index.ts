import { TerrainRenderStyle } from '../../../domain/translate'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec.ts'
import { convertToDefaultModelGrid } from './model/default.ts'
import { injectGridPositionToModels } from './inject.ts'
import { UnitSpec } from './types.ts'

export const convertToModelGrid = (
  renderGrid: RenderGrid,
  style: TerrainRenderStyle
): UnitSpec[] => {
  const modelCodeGrid = convertToDefaultModelGrid(renderGrid)
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types.ts'
