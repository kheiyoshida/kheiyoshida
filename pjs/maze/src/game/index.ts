import { paramBuild } from './maze/params.ts'
import { Maze } from './maze/legacy'
import { buildFloorStages } from './stage/stage.ts'
import { Player } from './player'
import { GameAggregate } from './game.ts'
import { Mapper } from './map'
import { StatusEventValues } from './player/status/delta.ts'

const maze = new Maze(buildFloorStages(), paramBuild)
const player = new Player(StatusEventValues)
const mapper = new Mapper()
export const game = new GameAggregate(maze, player, mapper)
