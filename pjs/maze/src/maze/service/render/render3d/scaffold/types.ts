import { IntRange } from 'utils'
import * as RenderSpec from '../../../../domain/compose/renderSpec'
import { Position3D } from 'p5utils/src/3d/types'

export type RenderBlockPosition = {
  z: IntRange<0, 6>
  x: RenderSpec.RenderPosition
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

/**
 * collection of consistant Positon3D
 * each RenderBlock should get the concrete value from this
 * currently supports 7 layers (=RenderGrid.length + 1)
 */
export type ScaffoldCoordinates = ScaffoldCoordLayer[]

export type ScaffoldCoordLayer = {
  upper: ScaffoldCoordLayerPart
  lower: ScaffoldCoordLayerPart
}

export type ScaffoldCoordLayerPart = { [k in ScaffoldCoordPosition]: Position3D }

export enum ScaffoldCoordPosition {
  LL = 0,
  CL = 1,
  CR = 2,
  RR = 3,
}
