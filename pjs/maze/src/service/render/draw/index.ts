import { ObjectDrawParams, TerrainRenderStyle } from '../../../domain/translate'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec'
import { createScaffold, ScaffoldValues } from '../scaffold'
import { convertRenderGridToUnitSpecList } from '../unit'
import { composeScene } from '../scene'
import { renderScene } from 'maze-gl'

export const drawTerrain = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  terrainStyle: TerrainRenderStyle,
  { alignment }: ObjectDrawParams
): void => {
  const scaffold = createScaffold(values)
  const specList = convertRenderGridToUnitSpecList(renderGrid)
  const scene = composeScene(scaffold, specList)
  renderScene(scene)
}
