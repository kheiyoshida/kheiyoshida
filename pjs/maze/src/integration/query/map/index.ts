import { mapper, maze, player } from '../../../game/setup'

export const getMapInfoFromCurrentState = () => ({
  grid: mapper.map,
  current: player.position,
  direction: player.direction,
  floor: maze.currentFloor,
})

export type MapInfo = ReturnType<typeof getMapInfoFromCurrentState>
