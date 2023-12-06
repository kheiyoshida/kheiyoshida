import { Direction } from '../domain/maze/direction'
import { Grid } from '../domain/maze/mapper'
import { Matrix } from '../domain/matrix'
import { Position } from '../utils/position'
import { StateManager, makeStore } from './make'

export type MazeStore = {
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

const initialState: MazeStore = {
  floor: 1,
  matrix: [],
  current: [0, 0],
  stairPos: [],
  direction: 'n',
  grid: [],
  mapOpen: false,
  sanity: 100,
  stamina: 100,
  acceptCommand: true
}

const makeMazeStore = makeStore<MazeStore>()

export const store: StateManager<MazeStore> = makeMazeStore(initialState)
