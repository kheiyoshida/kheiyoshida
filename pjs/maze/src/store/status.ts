import { MIN_STATUS_VALUE, MAX_STATUS_VALUE, INITIAL_STATUS } from 'src/config/status'
import { ReducerMap, clamp, makeStoreV2 } from 'utils'

export type StatusState = {
  sanity: number
  stamina: number
}

const initialState: StatusState = {
  sanity: INITIAL_STATUS,
  stamina: INITIAL_STATUS,
}

const reducers = {
  resetStatus: (s) => () => {
    s.sanity = INITIAL_STATUS
    s.stamina = INITIAL_STATUS
  },
  addStatusValue: (s) => (field: keyof StatusState, delta: number) => {
    s[field] = clamp(s[field] + delta, MIN_STATUS_VALUE, MAX_STATUS_VALUE)
  },
} satisfies ReducerMap<StatusState>

export const makeStatusStore = () => makeStoreV2<StatusState>(initialState)(reducers)
