import { Position3D } from 'p5utils/src/3d'

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
  BoxStair = 'BoxStair',
}

/**
 * geometry specifications to represent `RenderModel`
 */
export type GeometrySpec = {
  coords: ShapeCoordinates
  normalPosition: Position3D
}

/**
 * rectangle coordinates
 */
export type ShapeCoordinates = Position3D[]
