import { Position3D } from 'p5utils/src/3d/types'
import * as RenderSpec from '../../../domain/compose/renderSpec'

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

export type ScaffoldLengths = {
  floor: number
  path: number
  wall: number
}

/**
 * collection of consistant Positon3D
 * each RenderBlock should get the concrete value from this
 * currently supports 7 layers (=RenderGrid.length + 1)
 */
export type Scaffold = ScaffoldLayer[]

export type ScaffoldLayer = {
  upper: ScaffoldLayerPart
  lower: ScaffoldLayerPart
}

/**
 * index with `ScaffoldLayerCoordPosition`
 */
export type ScaffoldLayerPart = Position3D[]

export const ScaffoldLayerPartLength = 4

export enum ScaffoldLayerCoordPosition {
  LL = 0,
  CL = 1,
  CR = 2,
  RR = 3,
}
