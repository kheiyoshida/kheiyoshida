import { getMapInfoFromCurrentState, MapInfo } from './map'
import { getVision, Vision } from './vision'
import { getMusicCommands, MusicCommand } from './music'
import { getStructure, Structure } from './structure'
import { getMovement, Movement } from './movement'

export * from './music'
export * from './vision'
export * from './map'
export * from './structure'
export * from './movement'

export type DomainIntention = {
  structure: Structure
  vision: Vision
  movement: Movement
  map: MapInfo
  music: MusicCommand
}

export const getDomainIntention = (): DomainIntention => {
  return {
    structure: getStructure(),
    vision: getVision(),
    movement: getMovement(),
    map: getMapInfoFromCurrentState(),
    music: getMusicCommands(),
  }
}
