import { composeLogicalView, LogicalView } from '../../../game/view'
import { game } from '../../../game'
import { Block } from '../../../core/level/legacy/block.ts'
import { getMatrixItem } from '../../../core/_legacy/matrix.ts'
import { Position, sumPosition } from '../../../core/_legacy/position.ts'
import { positionalDirection } from '../../../core/grid/direction.ts'

export const getView = ():LogicalView => {
  return composeLogicalView(getPath(), game.player.direction)
}

function getPath(i = 0): Block[] {
  if (i > 2) return []
  const block = i === 0 ? game.currentPlayerBlock : getFrontBlock(i)
  if (block) {
    if (block.edges[game.player.direction]) return [block].concat(getPath(i + 1))
    else return [block]
  }
  return []
}

function getFrontBlock(dist = 1) {
  const front = getPlayerFrontPosition(dist)
  return getMatrixItem(game.maze.currentLevel, front)
}

function getPlayerFrontPosition(dist = 1): Position {
  return sumPosition(game.player.position, positionalDirection(game.player.direction, dist))
}
