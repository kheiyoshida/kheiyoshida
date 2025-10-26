import { getScaffoldParams, ScaffoldParams } from './scaffold.ts'
import { getModelingStyle, ModelingStyle } from '../../../game/maze/physical/modelingStyle.ts'
import { getView } from './view.ts'
import { convertRenderGridToUnitSpecList, UnitSpec } from './unit'

export * from '../../../game/view'
export type { ScaffoldParams, ModelingStyle }

export type Structure = {
  scaffold: ScaffoldParams
  renderGrid: UnitSpec[]
  terrainStyle: ModelingStyle
}

export const getStructure = (): Structure => ({
  renderGrid: convertRenderGridToUnitSpecList(getView(), getModelingStyle()),
  scaffold: getScaffoldParams(),
  terrainStyle: getModelingStyle(),
})
