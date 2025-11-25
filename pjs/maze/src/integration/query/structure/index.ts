import { getScaffoldParams, ScaffoldParams } from './scaffold.ts'
import { buildViewGrid } from './view/get.ts'
import { game } from '../../../game'
import { MazeView } from './view/view.ts'
import { AlternativeViewService } from './view/corridor.ts'

export const alternativeViewService = new AlternativeViewService()

export type StructureData = {
  scaffold: ScaffoldParams
  view: MazeView
}

export const getStructure = (): StructureData => ({
  view: buildViewGrid(game.maze.currentLevel.physicalGrid, game.player),
  scaffold: getScaffoldParams(),
})
