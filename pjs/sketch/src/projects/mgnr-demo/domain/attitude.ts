import { AttitudeThresholdFrames } from '../constants'
import { makeVariableStore } from '../state/variable'
import { Direction } from '../types'

export const updateAttitude = (
  dir: Direction,
  variableStore: ReturnType<typeof makeVariableStore>
) => {
  if (dir === 'go') {
    variableStore.updateAttitude('active')
    if (variableStore.current.active > AttitudeThresholdFrames) {
      variableStore.resetAttitude('still')
    }
  }
  if (dir === null || dir === 'left' || dir === 'right') {
    variableStore.updateAttitude('still')
    if (variableStore.current.still > AttitudeThresholdFrames) {
      variableStore.resetAttitude('active')
    }
  }
}
