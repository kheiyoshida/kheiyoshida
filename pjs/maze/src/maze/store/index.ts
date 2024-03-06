import { ReducerMap, makeStoreV2 } from 'utils'
import { Matrix } from '../domain/matrix'
import { Direction } from '../domain/maze/direction'
import { Grid, buildGrid } from '../domain/maze/mapper'
import { Position } from '../utils/position'
import { StatusField } from '../domain/stats'

export type MazeState = {
  matrix: Matrix
  floor: number
  current: Position
  stairPos: number[]
  direction: Direction
  grid: Grid
  mapOpen: boolean
  sanity: number
  stamina: number
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
  sanity: 100,
  stamina: 100,
  acceptCommand: true,
}

const reducers = {
  // map
  toggleMap: s => ()  => {
    s.mapOpen = !s.mapOpen
  },
  resetMap: s => (currentMatrix: Matrix) => {
    s.grid = buildGrid(currentMatrix)
  },
  updateMap: s => (newMap: Grid) => {
    s.grid = newMap
  },
  // matrix
  updateMatrix: s => (newMatrix: Matrix) => {
    s.matrix = newMatrix
  },
  updateCurrent: s => (current: Position) => {
    s.current = current
  },
  updateDirection: s => (direction: Direction) => {
    s.direction = direction
  },
  updateStairPos: s => (stairPos: Position) => {
    s.stairPos = stairPos
  },
  incrementFloor: s => () => {
    s.floor+= 1
  },
  // status 
  updateStatus: s => (field: StatusField, value: number) => {
    s[field] = value
  },
  // render
  updateAcceptCommand: s => (acceptCommand: boolean) => {
    s.acceptCommand = acceptCommand
  }
} satisfies ReducerMap<MazeState>

const makeMazeStore = () => makeStoreV2<MazeState>(initialState)(reducers)
export const store = makeMazeStore()
