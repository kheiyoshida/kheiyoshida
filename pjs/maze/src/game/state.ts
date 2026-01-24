import { makeStoreV2, ReducerMap } from 'utils'

export type MazeState = {
  blockControl: boolean
  blockStatusChange: boolean
}

const initialState: MazeState = {
  blockControl: false,
  blockStatusChange: false,
}

const reducers = {
  updateBlockControl: (s) => (blockControl: boolean) => {
    s.blockControl = blockControl
  },
  updateBlockStatusChange: (s) => (blockStatusChange: boolean) => {
    s.blockStatusChange = blockStatusChange
  },
} satisfies ReducerMap<MazeState>

const makeMazeStore = () => makeStoreV2<MazeState>(initialState)(reducers)
export const state = makeMazeStore()
