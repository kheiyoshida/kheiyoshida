import { Position3D } from 'p5utils/src/3d'
import * as RenderSpec from '../../../../domain/translate/renderGrid/renderSpec'

export type ModelGrid = ModelGridLayer[]

export type ModelGridLayer = [CompoundRenderModel, CompoundRenderModel, CompoundRenderModel]

export type CompoundRenderModel = RenderModel[]

export enum RenderModel {
  Floor = 'Floor',
  Ceil = 'Ceil',
  SideWall = 'SideWall',
  FrontWall = 'FrontWall',
  Stair = 'Stair',
  StairCeil = 'StairCeil',
  BoxTop = 'BoxTop',
  BoxMiddle = 'BoxMiddle',
  BoxBottom = 'BoxBottom',
  BoxStair = 'BoxStair'
}

/**
 * geometry specifications to represent `RenderModel`
 */
export type GeometrySpec = {
  coords: ShapeCoordinates
  normalPosition: Position3D
}

export type RenderBlock = {
  blockCoords: RenderBlockCoords
  position: RenderBlockPosition
}

/**
 * rectangle coordinates
 */
export type ShapeCoordinates = Position3D[]

export type RenderBlockPosition = {
  z: number
  x: RenderSpec.RenderPosition
  y?: number // maybe y in the future
}

export type RenderBlockCoords = {
  front: RenderBlockLayer
  rear: RenderBlockLayer
}

/**
 * defines the layer of render block's front or rear
 *  tl         tr
 *   '---------'
 *   |         |
 *   |         |
 *   '---------'
 *  bl         br
 */
export type RenderBlockLayer = {
  tl: Position3D
  tr: Position3D
  bl: Position3D
  br: Position3D
}
