import { makeStoreV2, ReducerMap } from 'utils'

export type MazeState = {
  mapOpen: boolean
  blockControl: boolean
  blockStatusChange: boolean
}

const initialState: MazeState = {
  mapOpen: false,
  blockControl: false,
  blockStatusChange: false,
}

const reducers = {
  openMap: (s) => () => {
    s.mapOpen = true
  },
  closeMap: (s) => () => {
    s.mapOpen = false
  },
  updateBlockControl: (s) => (blockControl: boolean) => {
    s.blockControl = blockControl
  },
  updateBlockStatusChange: (s) => (blockStatusChange: boolean) => {
    s.blockStatusChange = blockStatusChange
  },
} satisfies ReducerMap<MazeState>

const makeMazeStore = () => makeStoreV2<MazeState>(initialState)(reducers)
export const state = makeMazeStore()
