import { getScaffoldParams, ScaffoldParams } from './scaffold.ts'
import { getRenderGridFromCurrentState, RenderGrid } from './renderGrid'
import { getTerrainRenderStyle, TerrainStyle } from './terrainStyle.ts'

export * from './renderGrid'
export type { ScaffoldParams, TerrainStyle }

export type Structure = {
  scaffold: ScaffoldParams
  renderGrid: RenderGrid
  terrainStyle: TerrainStyle
}

export const getStructure = (): Structure => ({
  renderGrid: getRenderGridFromCurrentState(),
  scaffold: getScaffoldParams(),
  terrainStyle: getTerrainRenderStyle(),
})
