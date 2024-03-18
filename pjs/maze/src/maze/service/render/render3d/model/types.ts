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
