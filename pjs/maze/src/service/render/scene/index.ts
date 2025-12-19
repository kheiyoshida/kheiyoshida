import { RenderUnit } from 'maze-gl'
import { StructureData } from '../../../integration/query'
import { composeSceneObject } from '../object'
import { translateScaffoldParams } from '../scaffold/values.ts'
import { scaffold } from '../scaffold'
import { Atmosphere } from '../../../game/world/types.ts'
import { ViewX, ViewY, ViewZ } from '../../../integration/query/structure/view/view.ts'

export const getUnits = (
  mode: Atmosphere,
  { view, scaffold: scaffoldParams }: StructureData,
  liftY?: number
): RenderUnit[] => {
  scaffold.update(translateScaffoldParams(scaffoldParams))

  const units: RenderUnit[] = []

  view.iterate((viewPos, block) => {
    if (!block) return

    if (liftY && viewPos.x === ViewX.Center && viewPos.y === ViewY.Down1 && viewPos.z === ViewZ.L1) {
      const objects = block.objects.map(composeSceneObject(mode))
      objects.forEach((obj) => obj.transform.translateY = liftY)
      const unit: RenderUnit = {
        box: scaffold.getBox(viewPos),
        objects: objects
      }
      units.push(unit)
    } else {
      const unit: RenderUnit = {
        box: scaffold.getBox(viewPos),
        objects: block.objects.map(composeSceneObject(mode)),
      }
      units.push(unit)
    }
  })

  return units
}
