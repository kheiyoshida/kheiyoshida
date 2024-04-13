import { Position3D } from 'p5utils/src/3d/types'

export type ScaffoldValues = {
  floor: number
  path: number
  wall: number
  distortionRange: number
  distortionSpeed: number
}

/**
 * collection of consistant Positon3D
 * each RenderBlock should get the concrete value from this
 * currently supports 7 layers (=RenderGrid.length + 1)
 */
export type Scaffold<T extends ScaffoldEntity = Position3D> = ScaffoldLayer<T>[]

export type ScaffoldEntity = Position3D | DistortionDelta | unknown

export type ScaffoldLayerPartKey = 'upper' | 'lower'
export type ScaffoldLayer<T extends ScaffoldEntity = Position3D> = {
  [k in ScaffoldLayerPartKey]: ScaffoldLayerPart<T>
}

/**
 * index with `ScaffoldLayerCoordPosition`
 */
export type ScaffoldLayerPart<T extends ScaffoldEntity = Position3D> = T[]

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

export interface DistortionDelta {
  values: Position3D
  move(range: number, speed?: number): void
}
