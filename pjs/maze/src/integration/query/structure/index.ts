import { getScaffoldParams, ScaffoldParams } from './scaffold.ts'
import { LogicalView } from '../../../game/view'
import { getTerrainRenderStyle, TerrainStyle } from './terrainStyle.ts'
import { game } from '../../../game/setup'

export * from '../../../game/view'
export type { ScaffoldParams, TerrainStyle }

export type Structure = {
  scaffold: ScaffoldParams
  renderGrid: LogicalView
  terrainStyle: TerrainStyle
}

export const getStructure = (): Structure => ({
  renderGrid: game.getView(),
  scaffold: getScaffoldParams(),
  terrainStyle: getTerrainRenderStyle(),
})
