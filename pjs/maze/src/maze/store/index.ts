import { ReducerMap, makeStoreV2 } from 'utils'
import { Matrix } from './entities/matrix/matrix'
import { Direction } from '../domain/maze/direction'
import { Position } from '../utils/position'
import { makeStatusStore } from './status'
import { BuildMatrixParams, buildMatrix } from './entities/matrix'
import { Node } from './entities/matrix/node'
import { Grid, _track, buildGrid } from './entities/map'

export type MazeState = {
  matrix: Matrix
  floor: number
  current: Position
  stairPos: number[]
  direction: Direction
  grid: Grid
  mapOpen: boolean
  acceptCommand: boolean
}

const initialState: MazeState = {
  floor: 1,
  matrix: [],
  current: [0, 0],
  stairPos: [],
  direction: 'n',
  grid: [],
  mapOpen: false,
  acceptCommand: true,
}

const reducers = {
  // map
  toggleMap: (s) => () => {
    s.mapOpen = !s.mapOpen
  },
  resetMap: (s) => () => {
    s.grid = buildGrid(s.matrix)
  },
  trackMap: (s) => (from: Position, to: Position) => {
    const oldGrid = s.grid.slice()
    const newGrid = _track(oldGrid, from, to)
    store.updateMap(newGrid)
  },
  updateMap: (s) => (newMap: Grid) => {
    s.grid = newMap
  },
  // maze
  renewMatrix: (s) => (params: BuildMatrixParams) => {
    s.matrix = buildMatrix(params)
  },
  updateCurrent: (s) => (current: Position) => {
    s.current = current
  },
  updateDirection: (s) => (direction: Direction) => {
    s.direction = direction
  },
  setStair: (s) => (stairNode: Node) => {
    stairNode.setStair()
    s.stairPos = stairNode.pos
  },
  incrementFloor: (s) => () => {
    s.floor += 1
  },

  // render
  updateAcceptCommand: (s) => (acceptCommand: boolean) => {
    s.acceptCommand = acceptCommand
  },
} satisfies ReducerMap<MazeState>

const makeMazeStore = () => makeStoreV2<MazeState>(initialState)(reducers)
export const store = makeMazeStore()
export const statusStore = makeStatusStore()
