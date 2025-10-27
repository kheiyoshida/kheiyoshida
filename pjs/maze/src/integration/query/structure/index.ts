import { getScaffoldParams, ScaffoldParams } from './scaffold.ts'
import { getModelingStyle, ModelingStyle } from '../../../game/maze/physical/modelingStyle.ts'
import { buildViewGrid } from './view/get.ts'
import { game } from '../../../game'
import { MazeView } from './view/view.ts'

export type Structure = {
  scaffold: ScaffoldParams
  view: MazeView
  terrainStyle: ModelingStyle
}

export const getStructure = (): Structure => ({
  view: buildViewGrid(game.maze.currentLevel.physicalGrid, game.player),
  scaffold: getScaffoldParams(),
  terrainStyle: getModelingStyle(),
})
