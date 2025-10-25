import { getScaffoldParams, ScaffoldParams } from './scaffold.ts'
import { LogicalView } from '../../../game/view'
import { getModelingStyle, ModelingStyle } from '../../../game/maze/physical/modelingStyle.ts'
import { game } from '../../../game'

export * from '../../../game/view'
export type { ScaffoldParams, ModelingStyle }

export type Structure = {
  scaffold: ScaffoldParams
  renderGrid: LogicalView
  terrainStyle: ModelingStyle
}

export const getStructure = (): Structure => ({
  renderGrid: game.getView(),
  scaffold: getScaffoldParams(),
  terrainStyle: getModelingStyle(),
})
