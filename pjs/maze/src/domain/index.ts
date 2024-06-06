import { MazeState } from '../store'
import { StatusState } from '../store/status'
import { MapInfo, getMapInfoFromCurrentState } from './interface/mapper'
import {
  MusicCommand,
  ScaffoldParams,
  TextureParams,
  getMusicCommands,
  getScaffoldParams,
  getTextureParams,
  getWalkSpeedFromCurrentState,
} from './translate'
import { LightVariables, getLightColorIntention } from './translate/light'
import { getRenderGridFromCurrentState } from './translate/renderGrid'
import { RenderGrid } from './translate/renderGrid/renderSpec'

export type DomainIntention = {
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
  scaffold: ScaffoldParams
  light: LightVariables
  texture: TextureParams
  music: MusicCommand
}

export type ListenableState = Pick<MazeState, 'floor'> & StatusState

export const getDomainIntention = (): DomainIntention => {
  return {
    renderGrid: getRenderGridFromCurrentState(),
    speed: getWalkSpeedFromCurrentState(),
    map: getMapInfoFromCurrentState(),
    light: getLightColorIntention(),
    scaffold: getScaffoldParams(),
    texture: getTextureParams(),
    music: getMusicCommands()
  }
}
