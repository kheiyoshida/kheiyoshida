import { MazeState, statusStore, store } from '../store'
import { StatusState } from '../store/status'
import { getRenderGridFromCurrentState } from './compose'
import { RenderGrid } from './compose/renderSpec'
import { MapInfo, getMapInfoFromCurrentState } from './maze/mapper'
import { getRenderingSpeedFromCurrentState } from './stats'
import { domainColorLogic } from './color'
import { ColorIntention } from './color/types'

export type DomainIntention = {
  colorIntention: ColorIntention
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
}

export type ListenableState = Pick<MazeState, 'floor'> & StatusState

export const getVisionIntentionFromCurrentState = (): DomainIntention => {
  const state = {
    ...statusStore.current,
    floor: store.current.floor,
  }
  return {
    colorIntention: domainColorLogic(state),
    renderGrid: getRenderGridFromCurrentState(),
    speed: getRenderingSpeedFromCurrentState(),
    map: getMapInfoFromCurrentState(),
  }
}
