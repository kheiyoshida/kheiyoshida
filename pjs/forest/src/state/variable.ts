import { Position3D } from 'p5utils/src/3d'
import { ReducerMap, clamp, makeStoreV2, randomIntInclusiveBetween } from 'utils'
import { GroundY, InitialRoomVar, MaxRoomVar, MinRoomVar, RoomVarMaxDelta } from '../constants'
import { Attitude } from '../types'

type VariableState = {
  roomVar: number
  active: number
  still: number
  fieldCenter: Position3D
}

const initialState: VariableState = {
  roomVar: InitialRoomVar,
  active: 0,
  still: 0,
  fieldCenter: [0, GroundY, 0],
}

const reducers = {
  updateRoomVar: (s) => () => {
    const vary = randomIntInclusiveBetween(-RoomVarMaxDelta, RoomVarMaxDelta)
    s.roomVar = clamp(s.roomVar + vary, MinRoomVar, MaxRoomVar)
  },
  updateAttitude: (s) => (attitude: Attitude) => {
    s[attitude] += 1
  },
  resetAttitude: (s) => (attitude: Attitude) => {
    s[attitude] = 0
  },
  updateFieldCenter: (s) => (fieldCenter: Position3D) => {
    s.fieldCenter = fieldCenter
  },
} satisfies ReducerMap<VariableState>

export const makeVariableStore = () => makeStoreV2<VariableState>(initialState)(reducers)
export type VariableStore = ReturnType<typeof makeVariableStore>
