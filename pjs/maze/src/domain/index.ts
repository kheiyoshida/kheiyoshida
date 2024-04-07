import { MazeState } from '../store'
import { StatusState } from '../store/status'
import { getRenderGridFromCurrentState } from './compose'
import { RenderGrid } from './compose/renderSpec'
import { MapInfo, getMapInfoFromCurrentState } from './maze/mapper'
import {
  ScaffoldParams,
  getRenderingSpeedFromCurrentState,
  getScaffoldParams,
  getVisibilityFromCurrentState,
} from './stats'

export type DomainIntention = {
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
  visibility: number
  scaffold: ScaffoldParams
}

export type ListenableState = Pick<MazeState, 'floor'> & StatusState

export const getVisionIntentionFromCurrentState = (): DomainIntention => {
  return {
    renderGrid: getRenderGridFromCurrentState(),
    speed: getRenderingSpeedFromCurrentState(),
    map: getMapInfoFromCurrentState(),
    visibility: getVisibilityFromCurrentState(),
    scaffold: getScaffoldParams(),
  }
}
