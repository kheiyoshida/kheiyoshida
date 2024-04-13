import { Position3D } from 'p5utils/src/3d'
import * as RenderSpec from '../../../domain/translate/compose/renderSpec'

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
}

export type ShapeCoordinates = Position3D[]
export type GeometryCoordinates = ShapeCoordinates[]

export type RenderBlockPosition = {
  z: number
  x: RenderSpec.RenderPosition
  y?: never // maybe y in the future
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
