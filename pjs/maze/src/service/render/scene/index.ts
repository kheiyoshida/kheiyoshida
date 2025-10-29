import { RenderUnit } from 'maze-gl'
import { Structure } from '../../../integration/query'
import { RenderingMode } from '../../../game/stage'
import { composeSceneObject } from '../object'
import { translateScaffoldParams } from '../scaffold/values.ts'
import { scaffold } from '../scaffold'

export const getUnits = (
  mode: RenderingMode,
  { view, scaffold: scaffoldParams, terrainStyle }: Structure
): RenderUnit[] => {
  scaffold.update(translateScaffoldParams(scaffoldParams))

  const units: RenderUnit[] = []

  view.iterate((viewPos, block) => {
    if (!block) return

    const unit: RenderUnit = {
      box: scaffold.getBox(viewPos),
      objects: block.objects.map(composeSceneObject(mode)),
    }
    units.push(unit)
  })

  return units
}
