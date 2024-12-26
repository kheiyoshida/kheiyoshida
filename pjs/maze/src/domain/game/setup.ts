import { paramBuild } from './params/level.ts'
import { Maze } from '../entities/maze'
import { buildFloorStages } from './stage.ts'
import { statusStore, store } from '../../store'
import { Player } from '../entities/player'
import { Game } from '../entities/game.ts'
import { getMapper } from '../entities/map'

export const maze = new Maze(buildFloorStages(), paramBuild)
export const player = new Player(store, statusStore)
export const mapper = getMapper()
export const game = new Game(maze, player, mapper)
