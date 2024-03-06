import { fireByRate as random, randomItemFromArray as randomItem } from 'utils'
import { FinalMaze } from '.'
import { Position } from '../../utils/position'
import { compass } from '../maze/direction'
import { Matrix, getCorridorNodes, getDeadendNodes } from '../matrix'

export class BuildError extends Error {
  constructor(public type: 'no-deadend' | 'no-corridor') {
    super()
  }
}

export const initial = (matrix: Matrix) => {
  const corridors = getCorridorNodes(matrix)
  if (!corridors.length) throw new BuildError('no-corridor')
  const initialNode = randomItem(corridors)
  return {
    initialPos: initialNode.pos,
    initialDir: compass(random(0.5) ? 'r' : 'l', initialNode.corridorDirection!),
  }
}

export const setStair = (matrix: Matrix): Position => {
  const deadEnds = getDeadendNodes(matrix)
  if (!deadEnds.length) throw new BuildError('no-deadend')
  const stairNode = randomItem(deadEnds)
  stairNode.setStair()
  return stairNode.pos
}

export const finalize = (matrix: Matrix): FinalMaze => ({
  matrix,
  stairPos: setStair(matrix),
  ...initial(matrix),
})
