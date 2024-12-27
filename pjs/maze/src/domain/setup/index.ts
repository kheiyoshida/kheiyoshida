import { paramBuild } from './params/level.ts'
import { Maze } from '../entities/maze'
import { buildFloorStages } from './stage.ts'
import { Player } from '../entities/player'
import { Game } from '../entities/game.ts'
import { Mapper } from '../entities/map'
import { StatusEventValues } from './params/status.ts'

export const maze = new Maze(buildFloorStages(), paramBuild)
export const player = new Player(StatusEventValues)
export const mapper = new Mapper()
export const game = new Game(maze, player, mapper)
