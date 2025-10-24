import { paramBuild } from './params/level.ts'
import { Maze } from '../maze'
import { buildFloorStages } from './stage.ts'
import { Player } from '../../core/player'
import { Game } from '../game.ts'
import { Mapper } from '../map'
import { StatusEventValues } from './params/status.ts'

export const maze = new Maze(buildFloorStages(), paramBuild)
export const player = new Player(StatusEventValues)
export const mapper = new Mapper()
export const game = new Game(maze, player, mapper)
