import { Position3D } from "p5utils/src/3d"

export type ModelGrid = ModelGridLayer[]

export type ModelGridLayer = [CompoundRenderModel, CompoundRenderModel, CompoundRenderModel]

export type CompoundRenderModel = RenderModel[]

export enum RenderModel {
  Floor = 'Floor',
  Ceil = 'Ceil',
  SideWall = 'SideWall',
  FrontWall = 'FrontWall',
  Stair = 'Stair'
}

export type ShapeCoordinates = Position3D[]
export type GeometryCoordinates = ShapeCoordinates[]
