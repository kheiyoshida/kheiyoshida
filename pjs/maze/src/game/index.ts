import { paramBuild } from './maze/params.ts'
import { Maze } from './maze'
import { Player } from './player'
import { GameAggregate } from './game.ts'
import { Mapper } from './map/mapper.ts'
import { StatusEventValues } from './player/status/delta.ts'
import { StageContext } from './stage'

const maze = new Maze(new StageContext(), paramBuild)
const player = new Player(StatusEventValues)
const mapper = new Mapper()
export const game = new GameAggregate(maze, player, mapper)
