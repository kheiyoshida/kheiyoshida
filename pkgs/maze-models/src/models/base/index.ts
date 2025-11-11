import { GeometrySpec } from 'maze-gl'
import * as rectangles from './rectangles'
import * as objects from './objects'

export type BaseGeometryCode =
  | 'Floor'
  | 'Ceil'
  | 'Wall'
  | 'Octahedron'
  | 'Pole'
  | 'Tile'
  | 'StairTile'
  | 'StairCeil'
  | 'StairSteps'

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
}
