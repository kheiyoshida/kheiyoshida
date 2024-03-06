import { store } from '../../store'
import { Position, reducePosition } from '../../utils/position'
import { buildMaze } from '../build'
import { getMatrixItem } from '../../store/entities/matrix/matrix'
import { Node } from '../../store/entities/matrix/node'
import { resetDeadEndItems } from './deadend'
import { compass, positionalDirection } from './direction'

export const generateMaze = () => {
  const { matrix, initialPos, initialDir, stairPos } = buildMaze(store.current.floor)

  store.updateMatrix(matrix)
  store.updateCurrent(initialPos as Position)
  store.updateDirection(initialDir)
  store.updateStairPos(stairPos as Position)
}

export const query = {
  get matrix() {
    return store.current.matrix
  },
  get floor() {
    return store.current.floor
  },
  get current() {
    return store.current.current
  },
  get stairPos() {
    return store.current.stairPos
  },
  get direction() {
    return store.current.direction
  },
  get currentNode() {
    return this.matrix[this.current[0]][this.current[1]]!
  },
  get canProceed() {
    return this.currentNode.edges[this.direction]
  },
  get reachedStair() {
    return this.current[0] === this.stairPos[0] && this.current[1] === this.stairPos[1]
  },
}

export const goDownStairs = () => {
  store.incrementFloor()
  generateMaze()
  resetDeadEndItems()
}

export const navigate = () => {
  if (query.canProceed) {
    const from = query.current
    store.updateCurrent(getFrontLoc())
    return { from, dest: query.current }
  }
}

export const turn = (d: 'r' | 'l') => {
  store.updateDirection(compass(d, query.direction))
}

export const getFrontLoc = (dist = 1): Position => {
  const current = query.current
  return reducePosition(current, positionalDirection(query.direction, dist))
}

export const getFrontNode = ({ dist }: { dist: number } = { dist: 1 }) => {
  const front = getFrontLoc(dist)
  return getMatrixItem(query.matrix, front)
}

export const getPath = (i = 0): Node[] => {
  if (i > 2) return []
  const node = i === 0 ? query.currentNode : getFrontNode({ dist: i })
  if (node) {
    if (node.edges[query.direction]) return [node].concat(getPath(i + 1))
    else return [node]
  }
  return []
}
