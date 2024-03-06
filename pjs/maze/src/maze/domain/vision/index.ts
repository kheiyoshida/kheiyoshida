import { MazeState, statusStore, store } from '../../store'
import { StatusState } from '../../store/status'
import { ApplyColors } from './color'
import { DrawSpec } from './draw/types'
import { DrawSpecFinalizer } from './drawSpec/finalize'
import { FramesMaker } from './frame/framesMaker'
import { visionProviders } from './provider'
import { chooseStrategy } from './strategy'

/**
 * collection of methods to represent the current state
 */
export type Vision = {
  frames: FramesMaker
  draw: (specs: DrawSpec[][]) => void
  finalize: DrawSpecFinalizer
  renewColors: ApplyColors
}

/**
 * state fields consumed by vision
 */
export type ListenableState = Pick<MazeState, 'floor'> & StatusState

/**
 * finalize & provide vision, consuming current listenable state values
 */
const visionProvider = (state: ListenableState): Vision =>
  visionProviders[chooseStrategy(state)](state)

/**
 * make vision based on the current state
 * @returns vision
 */
export const makeVision = () =>
  visionProvider({
    ...statusStore.current,
    floor: store.current.floor,
  })
