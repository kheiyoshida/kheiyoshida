import { MazeState } from '../store'
import { StatusState } from '../store/status'
import { domainColorLogic } from './translate/color'
import { ColorOperationParams } from './translate/color/types'
import { getRenderGridFromCurrentState } from './translate/compose'
import { RenderGrid } from './translate/compose/renderSpec'
import { MapInfo, getMapInfoFromCurrentState } from './interface/mapper'
import {
  getWalkSpeedFromCurrentState,
  getScaffoldParams,
  getVisibilityFromCurrentState,
} from './translate'
import { ScaffoldParams } from './translate'

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
