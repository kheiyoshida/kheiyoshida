import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec'
import { createScaffold, ScaffoldValues } from '../scaffold'
import { convertRenderGridToUnitSpecList } from '../unit'
import { composeScene } from '../scene'
import { Eye, renderScene } from 'maze-gl'

export const drawTerrain = (renderGrid: RenderGrid, values: ScaffoldValues, eye: Eye): void => {
  const scaffold = createScaffold(values)
  const specList = convertRenderGridToUnitSpecList(renderGrid)

  const scene = composeScene(scaffold, specList, eye)

  renderScene(scene)
}
