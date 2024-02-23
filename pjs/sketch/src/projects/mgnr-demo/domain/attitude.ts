import { AttitudeThresholdFrames } from '../constants'
import { makeVariableStore } from '../state/variable'
import { MoveDirection } from '../types'

export const updateAttitude = (
  dir: MoveDirection[] | null,
  variableStore: ReturnType<typeof makeVariableStore>
) => {
  if (dir) {
    variableStore.updateAttitude('active')
    if (variableStore.current.active > AttitudeThresholdFrames) {
      variableStore.resetAttitude('still')
    }
  }
  if (dir === null) {
    variableStore.updateAttitude('still')
    if (variableStore.current.still > AttitudeThresholdFrames) {
      variableStore.resetAttitude('active')
    }
  }
}
