import { makeStoreV2, ReducerMap } from 'utils'
import { Matrix } from './entities/matrix/matrix'
import { Direction } from '../utils/direction'
import { Position } from '../utils/position'
import { makeStatusStore } from './status'
import { buildMatrix, BuildMatrixParams } from './entities/matrix'
import { Node } from './entities/matrix/node'
import { _track, buildGrid, Grid } from './entities/map'
import { FloorStage, StageContext } from './stage.ts'

export type MazeState = {
  matrix: Matrix
  floor: number
  current: Position
  stairPos: number[]
  direction: Direction
  grid: Grid
  mapOpen: boolean
  blockControl: boolean
  blockStatusChange: boolean
  stageQueue: FloorStage[]
}

const initialState: MazeState = {
  floor: 1,
  matrix: [],
  current: [0, 0],
  stairPos: [],
  direction: 'n',
  grid: [],
  mapOpen: false,
  blockControl: false,
  blockStatusChange: false,
  stageQueue: [],
}

const reducers = {
  // map
  openMap: (s) => () => {
    s.mapOpen = true
  },
  closeMap: (s) => () => {
    s.mapOpen = false
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
  setFloor: (s) => (floor: number) => {
    s.floor = floor
  },

  updateBlockControl: (s) => (blockControl: boolean) => {
    s.blockControl = blockControl
  },
  updateBlockStatusChange: (s) => (blockStatusChange: boolean) => {
    s.blockStatusChange = blockStatusChange
  },

  setStageQueue: (s) => (stageQueue: FloorStage[]) => {
    s.stageQueue = stageQueue
  },
  getStageContext: (s) => (): StageContext => {
    // TODO: handle the case when stages run out
    return {
      prev: s.stageQueue[s.floor - 2] || null,
      current: s.stageQueue[s.floor - 1], // B1F = index:0
      next: s.stageQueue[s.floor] || null,
    }
  },
} satisfies ReducerMap<MazeState>

const makeMazeStore = () => makeStoreV2<MazeState>(initialState)(reducers)
export const store = makeMazeStore()
export const statusStore = makeStatusStore()
