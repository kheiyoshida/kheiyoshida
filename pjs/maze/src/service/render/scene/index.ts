import {
  calcConcreteScaffoldValues,
  createScaffold,
  getRenderBlock,
  RenderBlockPosition,
  Scaffold,
} from '../scaffold'
import { convertRenderGridToUnitSpecList } from '../unit'
import { DeformedBox, RenderUnit } from 'maze-gl'
import { getMesh } from '../mesh'
import { Structure } from '../../../domain/query'
import { RenderingMode } from '../../../domain/entities/maze/stages'

export const getUnits = (
  mode: RenderingMode,
  { renderGrid, scaffold: scaffoldParams, terrainStyle }: Structure
): RenderUnit[] => {
  const scaffoldValues = calcConcreteScaffoldValues(scaffoldParams)
  const scaffold = createScaffold(scaffoldValues)
  const specList = convertRenderGridToUnitSpecList(renderGrid, terrainStyle)
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
