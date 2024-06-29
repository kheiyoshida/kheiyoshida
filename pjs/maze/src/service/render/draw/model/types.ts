/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RenderGrid } from '../../../../domain/translate/renderGrid/renderSpec'
import type { RenderBlockPosition } from '../scaffold'

export type GridConverter = (rendewrGrid: RenderGrid) => ModelCodeGrid

export type RenderModelType = 'dynamic' | 'static'

export type RenderModel = DynamicModel | StaticModel

type _RenderModel<T extends RenderModelType> = {
  type: T
  code: T extends 'dynamic' ? DynamicModelCode : StaticModelCode
  position: RenderBlockPosition
}

export type DynamicModel = _RenderModel<'dynamic'>
export type StaticModel = _RenderModel<'static'>

export type ModelCodeGrid = ModelCodeGridLayer[]

export type ModelCodeGridLayer = [CompoundModelCode, CompoundModelCode, CompoundModelCode]

export type CompoundModelCode = ModelCode[]

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
  Pole = 'Pole',
  Tile = 'Tile'
}

type Incl = {
  includes: (arg: ModelCode) => boolean
}

export const dynamicModelCodes = Object.entries(DynamicModelCode).map(
  ([_, val]) => val
) as DynamicModelCode[] & Incl

export const staticModelCodes = Object.entries(StaticModelCode).map(
  ([_, val]) => val
) as StaticModelCode[] & Incl
