import { MazeState } from '../store'
import { StatusState } from '../store/status'
import { MapInfo, getMapInfoFromCurrentState } from './interface/mapper'
import {
  ScaffoldParams,
  getScaffoldParams,
  getVisibilityFromCurrentState,
  getWalkSpeedFromCurrentState,
} from './translate'
import { domainColorLogic } from './translate/color'
import { ColorOperationParams } from './translate/color/types'
import { getRenderGridFromCurrentState } from './translate/renderGrid'
import { RenderGrid } from './translate/renderGrid/renderSpec'

export type DomainIntention = {
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
  visibility: number
  scaffold: ScaffoldParams
  color: ColorOperationParams
}

export type ListenableState = Pick<MazeState, 'floor'> & StatusState

export const getDomainIntention = (): DomainIntention => {
  return {
    renderGrid: getRenderGridFromCurrentState(),
    speed: getWalkSpeedFromCurrentState(),
    map: getMapInfoFromCurrentState(),
    visibility: getVisibilityFromCurrentState(),
    scaffold: getScaffoldParams(),
    color: domainColorLogic(),
  }
}
