import { getMapInfoFromCurrentState, MapInfo } from './mutate/mapper'
import {
  getMusicCommands,
  getScaffoldParams,
  getWalkSpeedFromCurrentState,
  MusicCommand,
  ScaffoldParams,
} from './query'
import { getLightColorIntention, LightVariables } from './query/light'
import { getRenderGridFromCurrentState } from './query/renderGrid'
import { RenderGrid } from './query/renderGrid/renderSpec'
import {
  getObjectParams,
  getTerrainRenderStyle,
  ObjectDrawParams,
  TerrainRenderStyle,
} from './query/object.ts'
import { ColorParams } from './query/color/types.ts'
import { getColorParams } from './query/color'

export type DomainIntention = {
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
  scaffold: ScaffoldParams
  light: LightVariables
  color: ColorParams
  music: MusicCommand
  terrainStyle: TerrainRenderStyle
  objectParams: ObjectDrawParams
}

export const getDomainIntention = (): DomainIntention => {
  return {
    renderGrid: getRenderGridFromCurrentState(),
    speed: getWalkSpeedFromCurrentState(),
    map: getMapInfoFromCurrentState(),
    light: getLightColorIntention(),
    scaffold: getScaffoldParams(),
    color: getColorParams(),
    music: getMusicCommands(),
    terrainStyle: getTerrainRenderStyle(),
    objectParams: getObjectParams(),
  }
}
