import { MazeState, statusStore, store } from '../../store'
import { StatusState } from '../../store/status'
import { ApplyColors, domainColorLogic, resolveColorIntention } from './color'
import { ColorIntention } from './color/scenes'
import { allInOneDrawer } from './draw/drawers'
import { getDrawParams } from './draw/parameters'
import { DrawParams, DrawSpec } from './draw/types'
import { FinalizerMap } from './drawSpec'
import { DrawSpecFinalizer } from './drawSpec/finalize'
import { FrameMakerParams, calcFrameProviderParams, consumeFrameMakerParams } from './frame'
import { FramesMaker } from './frame/framesMaker'
import { VisionStrategy, chooseStrategy } from './strategy'

export type VisionIntention = {
  strategy: VisionStrategy
  framesMakerParams: FrameMakerParams
  drawParams: DrawParams
  colorIntention: ColorIntention
}

export type Vision = {
  frames: FramesMaker
  draw: (specs: DrawSpec[][]) => void
  finalize: DrawSpecFinalizer
  renewColors: ApplyColors
}

export type ListenableState = Pick<MazeState, 'floor'> & StatusState

export const getVisionFromCurrentState = (): Vision => {
  const visionIntention = getVisionIntention({
    ...statusStore.current,
    floor: store.current.floor,
  })
  return consumeVisionIntention(visionIntention)
}

const getVisionIntention = (state: ListenableState): VisionIntention => {
  const strategy = chooseStrategy(state)
  return {
    strategy,
    framesMakerParams: calcFrameProviderParams(state),
    drawParams: getDrawParams(state),
    colorIntention: domainColorLogic(state),
  }
}

const consumeVisionIntention = ({
  strategy,
  framesMakerParams,
  drawParams,
  colorIntention,
}: VisionIntention): Vision => {
  return {
    frames: consumeFrameMakerParams(strategy, framesMakerParams),
    draw: allInOneDrawer(drawParams),
    finalize: FinalizerMap[strategy],
    renewColors: resolveColorIntention(colorIntention),
  }
}
