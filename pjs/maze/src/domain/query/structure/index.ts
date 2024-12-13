import { getScaffoldParams, ScaffoldParams } from './scaffold.ts'
import { getRenderGridFromCurrentState, RenderGrid } from './renderGrid'
import { getTerrainRenderStyle, TerrainRenderStyle } from './terrainStyle.ts'

export * from './renderGrid'
export type { ScaffoldParams, TerrainRenderStyle }

export type Structure = {
  scaffold: ScaffoldParams
  renderGrid: RenderGrid
  terrainStyle: TerrainRenderStyle
}

export const getStructure = (): Structure => ({
  renderGrid: getRenderGridFromCurrentState(),
  scaffold: getScaffoldParams(),
  terrainStyle: getTerrainRenderStyle(),
})
