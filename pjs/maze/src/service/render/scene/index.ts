import { calcConcreteScaffoldValues, createScaffold, getRenderBlock, RenderBlockPosition, Scaffold } from '../scaffold'
import { DeformedBox, RenderUnit } from 'maze-gl'
import { Structure } from '../../../integration/query'
import { RenderingMode } from '../../../game/stage'
import { composeSceneObject } from '../object'
import { ViewX, ViewY } from '../../../integration/query/structure/view/view.ts'

export const getUnits = (
  mode: RenderingMode,
  { view, scaffold: scaffoldParams, terrainStyle }: Structure
): RenderUnit[] => {
  const scaffoldValues = calcConcreteScaffoldValues(scaffoldParams)
  const scaffold = createScaffold(scaffoldValues)

  const units: RenderUnit[] = []

  view.iterate((viewPos, block) => {
    if (!block) return

    // TODO: support these new layers
    if (viewPos.x < ViewX.Left1 || viewPos.x > ViewX.Right1) return;
    if (viewPos.y !== ViewY.Middle) return;

    const unit: RenderUnit = {
      box: getDeformedBox(scaffold, viewPos),
      objects: block.objects.map(composeSceneObject(mode)),
    }
    units.push(unit)
  })

  return units
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
