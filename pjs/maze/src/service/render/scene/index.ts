import { RenderUnit } from 'maze-gl'
import { StructureData } from '../../../integration/query'
import { composeSceneObject } from '../object'
import { translateScaffoldParams } from '../scaffold/values.ts'
import { scaffold } from '../scaffold'
import { Atmosphere } from '../../../game/world/types.ts'

export const getUnits = (
  mode: Atmosphere,
  { view, scaffold: scaffoldParams }: StructureData
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
