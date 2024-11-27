import {
  createScaffold,
  getRenderBlock,
  RenderBlockPosition,
  Scaffold,
  ScaffoldValues,
} from '../scaffold'
import { convertRenderGridToUnitSpecList } from '../unit'
import { DeformedBox, RenderUnit } from 'maze-gl'
import { getMesh } from '../mesh'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec.ts'
import { TerrainRenderStyle } from '../../../domain/translate/object.ts'

export const getUnits = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  style: TerrainRenderStyle
): RenderUnit[] => {
  const scaffold = createScaffold(values)
  const specList = convertRenderGridToUnitSpecList(renderGrid, style)
  return specList.map((spec) => ({
    box: getDeformedBox(scaffold, spec.position),
    meshes: spec.codes.map(getMesh),
  }))
}

const getDeformedBox = (scaffold: Scaffold, position: RenderBlockPosition): DeformedBox => {
  const block = getRenderBlock(scaffold, position)
  return {
    FBL: block.front.bl,
    FBR: block.front.br,
    FTL: block.front.tl,
    FTR: block.front.tr,
    BBL: block.rear.bl,
    BBR: block.rear.br,
    BTL: block.rear.tl,
    BTR: block.rear.tr,
  }
}
