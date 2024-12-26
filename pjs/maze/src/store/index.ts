import { makeStoreV2, ReducerMap } from 'utils'
import { MazeLevel } from '../domain/entities/maze/level.ts'
import { Direction } from '../domain/entities/utils/direction.ts'
import { Position } from '../domain/entities/utils/position.ts'
import { makeStatusStore } from './status'
import { Map } from '../domain/entities/map'
import { FloorStage } from '../domain/entities/maze/stages'

export type MazeState = {
  // maze aggregate
  matrix: MazeLevel

  // player
  floor: number
  current: Position
  direction: Direction

  // map
  grid: Map

  // stage
  stageQueue: FloorStage[]

  // service state?
  mapOpen: boolean
  blockControl: boolean
  blockStatusChange: boolean
}

const initialState: MazeState = {
  floor: 1,
  matrix: [],
  current: [0, 0],

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
  updateMap: (s) => (newMap: Map) => {
    s.grid = newMap
  },
  // maze
  renewMatrix: (s) => (matrix: MazeLevel) => {
    s.matrix = matrix
  },
  updateCurrent: (s) => (current: Position) => {
    s.current = current
  },
  updateDirection: (s) => (direction: Direction) => {
    s.direction = direction
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
} satisfies ReducerMap<MazeState>

const makeMazeStore = () => makeStoreV2<MazeState>(initialState)(reducers)
export const store = makeMazeStore()
export const statusStore = makeStatusStore()

export type MazeStore = typeof store;
export type StatusStore = typeof statusStore;
