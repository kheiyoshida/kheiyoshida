import { ReducerMap, clamp, makeStoreV2, randomIntInclusiveBetween } from 'utils'
import { InitialRoomVar, MaxRoomVar, MinRoomVar } from '../constants'

type VariableState = {
  roomVar: number
  active: number
  still: number
}

type Attitude = 'active' | 'still'

const reducers = {
  updateRoomVar: (s) => () => {
    const vary = randomIntInclusiveBetween(-10, 10)
    s.roomVar = clamp(s.roomVar + vary, MinRoomVar, MaxRoomVar)
  },
  updateAttitude: (s) => (attitude: Attitude) => {
    s[attitude] += 1
  },
  resetAttitude: (s) => (attitude: Attitude) => {
    s[attitude] = 0
  }
} satisfies ReducerMap<VariableState>

export const makeVariableStore = () =>
  makeStoreV2<VariableState>({
    roomVar: InitialRoomVar,
    active: 0,
    still: 0,
  })(reducers)
