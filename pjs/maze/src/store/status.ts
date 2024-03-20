import { ReducerMap, clamp, makeStoreV2 } from 'utils'

const MAX_STATUS_VALUE = 100
const MIN_STATUS_VALUE = 0

export type StatusState = {
  sanity: number
  stamina: number
}

const initialState: StatusState = {
  sanity: 100,
  stamina: 100,
}

const reducers = {
  addStatusValue: (s) => (field: keyof StatusState, delta: number) => {
    s[field] = clamp(s[field] + delta, MIN_STATUS_VALUE, MAX_STATUS_VALUE)
  },
} satisfies ReducerMap<StatusState>

export const makeStatusStore = () => makeStoreV2<StatusState>(initialState)(reducers)
