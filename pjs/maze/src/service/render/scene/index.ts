import {
  calcConcreteScaffoldValues,
  createScaffold,
  getRenderBlock,
  RenderBlockPosition,
  Scaffold,
} from '../scaffold'
import { DeformedBox, RenderUnit } from 'maze-gl'
import { getMesh } from '../mesh'
import { Structure } from '../../../integration/query'
import { RenderingMode } from '../../../game/stage'

export const getUnits = (
  mode: RenderingMode,
  { renderGrid, scaffold: scaffoldParams, terrainStyle }: Structure
): RenderUnit[] => {
  const scaffoldValues = calcConcreteScaffoldValues(scaffoldParams)
  const scaffold = createScaffold(scaffoldValues)
  const specList = renderGrid
  return specList.map((spec) => ({
    box: getDeformedBox(scaffold, spec.position),
    meshes: spec.codes.map((code) => getMesh(code, mode)),
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
