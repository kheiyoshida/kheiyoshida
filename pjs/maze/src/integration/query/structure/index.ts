import { getScaffoldParams, ScaffoldParams } from './scaffold.ts'
import { buildViewGrid } from './view/get.ts'
import { game } from '../../../game'
import { MazeView } from './view/view.ts'
import { getModelingStyle } from './getModelingStyle.ts'
import { Structure } from '../../../game/world'

export type StructureData = {
  scaffold: ScaffoldParams
  view: MazeView
  // terrainStyle: Structure
}

export const getStructure = (): StructureData => ({
  view: buildViewGrid(game.maze.currentLevel.physicalGrid, game.player),
  scaffold: getScaffoldParams(),
  // terrainStyle: getModelingStyle(),
})
