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

export const getUnits = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
): RenderUnit[] => {
  const scaffold = createScaffold(values)
  const specList = convertRenderGridToUnitSpecList(renderGrid)
  return specList.map((spec) => ({
    box: getDeformedBox(scaffold, spec.position),
    meshes: spec.codes.map(getMesh),
  }))
}

const getDeformedBox = (scaffold: Scaffold, position: RenderBlockPosition): DeformedBox => {
  const block = getRenderBlock(scaffold, position)
  return {
    // TODO: y values inverted.
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
