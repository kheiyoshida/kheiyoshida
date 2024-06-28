import type { RenderGrid } from '../../../../domain/translate/renderGrid/renderSpec'
import type { RenderBlockPosition } from '../scaffold'

export type GridConverter = (rendewrGrid: RenderGrid) => ModelGrid

export type RenderModelType = 'dynamic' | 'static'

export type RenderModel<T extends RenderModelType> = {
  type: T
  code: T extends 'dynamic' ? DynamicModelCode : StaticModelCode
  position: RenderBlockPosition
}

export type DynamicModel = RenderModel<'dynamic'>
export type StaticModel = RenderModel<'static'>

export type ModelGrid = ModelGridLayer[]

export type ModelGridLayer = [CompoundRenderModel, CompoundRenderModel, CompoundRenderModel]

export type CompoundRenderModel = ModelCode[]

export type ModelCode = DynamicModelCode | StaticModelCode

export enum DynamicModelCode {
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

export enum StaticModelCode {
  Tree = 'Tree',
}
