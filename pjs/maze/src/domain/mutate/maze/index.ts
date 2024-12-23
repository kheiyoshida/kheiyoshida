import { fireByRate, randomItemFromArray } from 'utils'
import { store } from '../../../store'
import {
  MazeLevel,
  getCorridorNodes,
  getDeadendNodes,
  getMatrixItem,
} from '../../../store/entities/matrix/matrix'
import { Block as Node } from '../../../store/entities/matrix/block.ts'
import { Position, reducePosition } from '../../../utils/position'
import { getTurnedDirection, positionalDirection } from '../../../utils/direction'
import { paramBuild } from './params'
import { LR } from "src/utils/direction"

export const generateMaze = () => {
  const params = paramBuild(store.current.floor)
  store.renewMatrix(params)
  const { stairNode, initialNode, initialDirection } = retrieveInitialPositions(
    store.current.matrix
  )
  store.updateCurrent(initialNode.pos as Position)
  store.updateDirection(initialDirection)
  store.setStair(stairNode)
}

const retrieveInitialPositions = (matrix: MazeLevel) => {
  const deadEnds = getDeadendNodes(matrix)
  const corridorNodes = getCorridorNodes(matrix)
  const stairNode = randomItemFromArray(deadEnds)
  const initialNode = randomItemFromArray(corridorNodes)
  const initialDirection = getTurnedDirection(fireByRate(0.5) ? 'right' : 'left', initialNode.corridorDirection!)
  return { stairNode, initialNode, initialDirection }
}

export const query = {
  get currentNode() {
    return store.current.matrix[store.current.current[0]][store.current.current[1]]!
  },
  get canProceed() {
    return this.currentNode.edges[store.current.direction]
  },
  get reachedStair() {
    return (
      store.current.current[0] === store.current.stairPos[0] &&
      store.current.current[1] === store.current.stairPos[1]
    )
  },
}

export const goDownStairs = () => {
  store.incrementFloor()
  generateMaze()
}

export const navigate = () => {
  if (query.canProceed) {
    const from = store.current.current
    store.updateCurrent(getFrontLoc())
    return { from, dest: store.current.current }
  }
}

export const turn = (d: LR) => {
  store.updateDirection(getTurnedDirection(d, store.current.direction))
}

export const getFrontLoc = (dist = 1): Position => {
  const current = store.current.current
  return reducePosition(current, positionalDirection(store.current.direction, dist))
}

export const getFrontNode = ({ dist }: { dist: number } = { dist: 1 }) => {
  const front = getFrontLoc(dist)
  return getMatrixItem(store.current.matrix, front)
}

export const getPath = (i = 0): Node[] => {
  if (i > 2) return []
  const node = i === 0 ? query.currentNode : getFrontNode({ dist: i })
  if (node) {
    if (node.edges[store.current.direction]) return [node].concat(getPath(i + 1))
    else return [node]
  }
  return []
}
