import { MazeState, statusStore, store } from '../../store'
import { StatusState } from '../../store/status'
import { getRenderGridFromCurrentState } from '../compose'
import { RenderGrid } from '../compose/renderSpec'
import { MapInfo, getMapInfoFromCurrentState } from '../maze/mapper'
import { getRenderingSpeedFromCurrentState } from '../stats'
import { domainColorLogic } from './color'
import { ColorIntention } from './color/types'
import { DrawParams, getDrawParams } from './drawParams'
import { FrameMakerParams, calcFrameProviderParams } from './frameMake'
import { VisionStrategy, chooseStrategy } from './strategy'

export type VisionIntention = {
  strategy: VisionStrategy
  framesMakerParams: FrameMakerParams
  drawParams: DrawParams
  colorIntention: ColorIntention,
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
}

export type ListenableState = Pick<MazeState, 'floor'> & StatusState

export const getVisionIntentionFromCurrentState = (): VisionIntention => {
  const state = {
    ...statusStore.current,
    floor: store.current.floor,
  }
  const strategy = chooseStrategy(state)
  return {
    strategy,
    framesMakerParams: calcFrameProviderParams(state),
    drawParams: getDrawParams(state),
    colorIntention: domainColorLogic(state),
    renderGrid: getRenderGridFromCurrentState(),
    // renderGrid: [null, null, [1, 1, 1], [0, 0, 1], [1, 0, 1], [1, 0, 0]],
    speed: getRenderingSpeedFromCurrentState(),
    map: getMapInfoFromCurrentState()
  }
}
