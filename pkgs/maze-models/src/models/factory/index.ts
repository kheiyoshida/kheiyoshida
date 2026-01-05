import { GeometrySpec } from 'maze-gl'
import * as rectangles from './rectangles'
import * as objects from './objects'
import { ModelCode } from '../code'
import { boxSpec, stairBoxSpec } from './primitives/box'

export type BaseGeometryCode =
  | 'Floor'
  | 'Ceil'
  | 'Wall'
  | 'Octahedron'
  | 'Pole'
  | 'Tile'
  | 'BottomTile'
  | 'StairTile'
  | 'StairCeil'
  | 'StairSteps'
  | 'Box'
  | 'StairBox'

export const BaseGeometryMap: Record<BaseGeometryCode, GeometrySpec> = {
  Ceil: rectangles.Ceil,
  Floor: rectangles.Floor,
  Wall: rectangles.FrontWall,
  Octahedron: objects.Octahedron,
  Pole: objects.Pole,
  StairCeil: rectangles.StairCeil,
  StairSteps: rectangles.StairSteps,
  StairTile: objects.Tile,
  Tile: objects.Tile,
  BottomTile: objects.BottomTile,
  Box: boxSpec,
  StairBox: stairBoxSpec,
}

const conversionMap: Record<ModelCode, BaseGeometryCode> = {
  Pole1: 'Pole',
  Pole2: 'Pole',
  Pole3: 'Pole',
  Pole4: 'Pole',
  Pole5: 'Pole',
  BottomTile: 'BottomTile',
  Ceil: 'Ceil',
  Floor: 'Floor',
  StairCeil: 'StairCeil',
  StairSteps: 'StairSteps',
  StairTile: 'StairTile',
  Tile: 'Tile',
  Wall: 'Wall',
  Warp: 'Octahedron',
  FloatingBox: 'Box',
  FloatingFloorBox: 'Box',
  FloatingStairBox: 'Box',
  StackableBox: 'Box',
  StackableStairBox: 'StairBox',
}

/**
 * get the base geometry spec. it deep-copies the geometry spec
 * @param code
 */
export const getBaseGeometry = (code: ModelCode) => {
  return JSON.parse(JSON.stringify(BaseGeometryMap[conversionMap[code]]))
}
