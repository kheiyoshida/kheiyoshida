import { MazeState, statusStore, store } from '../../store'
import { StatusState } from '../../store/status'
import { ApplyColors } from './color'
import { DrawSpec } from './draw/types'
import { DrawSpecFinalizer } from './drawSpec/finalize'
import { FramesMaker } from './frame/framesMaker'
import { VisionProviderMap } from './provider'
import { chooseStrategy } from './strategy'

export type Vision = {
  frames: FramesMaker
  draw: (specs: DrawSpec[][]) => void
  finalize: DrawSpecFinalizer
  renewColors: ApplyColors
}

export type ListenableState = Pick<MazeState, 'floor'> & StatusState

export const getVisionFromCurrentState = () =>
  getVision({
    ...statusStore.current,
    floor: store.current.floor,
  })

const getVision = (state: ListenableState): Vision => {
  const strategy = chooseStrategy(state)
  const visionProvider = VisionProviderMap[strategy]
  return visionProvider(state)
}
