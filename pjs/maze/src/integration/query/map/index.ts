import { game } from '../../../game'

export const getMapInfoFromCurrentState = () => ({
  grid: game.mapper.map,
  current: game.player.position,
  direction: game.player.direction,
  floor: game.maze.currentFloor,
})

export type MapInfo = ReturnType<typeof getMapInfoFromCurrentState>
