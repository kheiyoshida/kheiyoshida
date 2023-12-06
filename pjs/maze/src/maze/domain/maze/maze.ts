import { store } from '../../store'
import { Position, reducePosition, validatePosition } from '../../utils/position'
import { build } from '../build'
import { resetDeadEndItems } from './deadend'
import { compass, positionalDirection } from './direction'
import { getMatrixItem } from '../matrix'
import { Node } from '../matrix/node'

export const generateMaze = () => {
  const { matrix, initialPos, initialDir, stairPos } = build(
    store.read('floor')
  )
  store.batchUpdate({
    matrix,
    current: initialPos as Position,
    direction: initialDir,
    stairPos,
  })
}

export const query = {
  get matrix() {
    return store.read('matrix')
  },
  get floor() {
    return store.read('floor')
  },
  get current() {
    return store.read('current')
  },
  get stairPos() {
    return store.read('stairPos')
  },
  get direction() {
    return store.read('direction')
  },
  get currentNode() {
    return this.matrix[this.current[0]][this.current[1]]!
  },
  get canProceed() {
    return this.currentNode.edges[this.direction]
  },
  get reachedStair() {
    return (
      this.current[0] === this.stairPos[0] &&
      this.current[1] === this.stairPos[1]
    )
  },
}

export const goDownStairs = () => {
  store.update('floor', (f) => f + 1)
  generateMaze()
  resetDeadEndItems()
}

export const navigate = () => {
  if (query.canProceed) {
    const from = query.current
    store.update('current', getFrontLoc())
    return { from, dest: query.current }
  }
}

export const turn = (d: 'r' | 'l') => {
  store.update('direction', compass(d, query.direction))
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
