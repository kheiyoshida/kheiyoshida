import { Vector3D } from 'maze-gl'
import { GPosX } from '../../../integration/query'

export type ScaffoldValues = {
  floor: number
  path: number
  wall: number
  distortionRange: number
  distortionSpeed: number
}

/**
 * collection of consistent Position3D
 * each RenderBlock should get the concrete value from this
 * currently supports 7 layers (=RenderGrid.length + 1)
 */
export type Scaffold<T extends ScaffoldEntity = Vector3D> = ScaffoldLayer<T>[]

export type ScaffoldEntity = Vector3D | DistortionDelta | unknown

export type ScaffoldLayerPartKey = 'upper' | 'lower'
export type ScaffoldLayer<T extends ScaffoldEntity = Vector3D> = {
  [k in ScaffoldLayerPartKey]: ScaffoldLayerPart<T>
}

/**
 * index with `ScaffoldLayerCoordPosition`
 */
export type ScaffoldLayerPart<T extends ScaffoldEntity = Vector3D> = T[]

export const ScaffoldLayerPartLength = 4

export enum ScaffoldLayerCoordPosition {
  LL = 0,
  CL = 1,
  CR = 2,
  RR = 3,
}

export type ScaffoldKey = {
  layerIndex: number
  partKey: ScaffoldLayerPartKey
  position: ScaffoldLayerCoordPosition
}

export type DistortionDelta = {
  values: Vector3D

  move(range: number, speed?: number): void
}

export type RenderBlockPosition = {
  z: number
  x: GPosX
  y?: number // maybe y in the future
}

export type RenderBlock = {
  front: RenderBlockLayer
  rear: RenderBlockLayer
}

/**
 * defines the layer of light.ts block's front or rear
 *  tl         tr
 *   '---------'
 *   |         |
 *   |         |
 *   '---------'
 *  bl         br
 */
export type RenderBlockLayer = {
  tl: Vector3D
  tr: Vector3D
  bl: Vector3D
  br: Vector3D
}
