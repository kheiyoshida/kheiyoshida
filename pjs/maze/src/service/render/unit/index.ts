import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec.ts'
import { convertToDefaultModelGrid } from './geometry/default.ts'
import { UnitSpec } from './types.ts'
import { injectGridPositionToModels } from './inject.ts'

export const convertRenderGridToUnitSpecList = (renderGrid: RenderGrid): UnitSpec[] => {
  const modelCodeGrid = convertToDefaultModelGrid(renderGrid)
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types.ts'
