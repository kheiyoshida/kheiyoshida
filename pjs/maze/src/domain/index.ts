import { MazeState } from '../store'
import { StatusState } from '../store/status'
import { getMapInfoFromCurrentState, MapInfo } from './interface/mapper'
import {
  getMusicCommands,
  getScaffoldParams,
  getTextureParams,
  getWalkSpeedFromCurrentState,
  MusicCommand,
  ScaffoldParams,
  TextureParams,
} from './translate'
import { getLightColorIntention, LightVariables } from './translate/light'
import { getRenderGridFromCurrentState } from './translate/renderGrid'
import { RenderGrid } from './translate/renderGrid/renderSpec'
import {
  getObjectParams,
  getTerrainRenderStyle,
  ObjectDrawParams,
  TerrainRenderStyle,
} from './translate/object.ts'

export type DomainIntention = {
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
  scaffold: ScaffoldParams
  light: LightVariables
  texture: TextureParams
  music: MusicCommand
  terrainStyle: TerrainRenderStyle
  objectParams: ObjectDrawParams
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
    music: getMusicCommands(),
    terrainStyle: getTerrainRenderStyle(),
    objectParams: getObjectParams(),
  }
}
