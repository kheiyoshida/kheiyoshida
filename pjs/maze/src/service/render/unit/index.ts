import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec.ts'
import { convertToDefaultModelGrid } from './geometry/default.ts'
import { UnitSpec } from './types.ts'
import { injectGridPositionToModels } from './inject.ts'

export const convertRenderGridToUnitSpecList = (renderGrid: RenderGrid): UnitSpec[] => {
  const modelCodeGrid = convertToDefaultModelGrid(
    // TODO: Now we reverse twice in the pipeline. Use the order where front layer has index 0
    renderGrid.reverse() as RenderGrid,
  )
  return injectGridPositionToModels(modelCodeGrid)
}

export * from './types.ts'
