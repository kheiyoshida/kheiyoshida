import { MazeState } from '../store'
import { StatusState } from '../store/status'
import { MapInfo, getMapInfoFromCurrentState } from './interface/mapper'
import { ScaffoldParams, getScaffoldParams, getWalkSpeedFromCurrentState } from './translate'
import { domainColorLogic } from './translate/color'
import { ColorOperationParams } from './translate/color/types'
import { LightVariables, getLightColorIntention } from './translate/light'
import { getRenderGridFromCurrentState } from './translate/renderGrid'
import { RenderGrid } from './translate/renderGrid/renderSpec'

export type DomainIntention = {
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
  light: LightVariables
  scaffold: ScaffoldParams
  color: ColorOperationParams
}

export type ListenableState = Pick<MazeState, 'floor'> & StatusState

export const getDomainIntention = (): DomainIntention => {
  return {
    renderGrid: getRenderGridFromCurrentState(),
    speed: getWalkSpeedFromCurrentState(),
    map: getMapInfoFromCurrentState(),
    light: getLightColorIntention(),
    scaffold: getScaffoldParams(),
    color: domainColorLogic(),
  }
}
