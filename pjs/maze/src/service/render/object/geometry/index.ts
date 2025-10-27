import { GeometrySpec } from 'maze-gl'
import * as rectangles from './rectangles.ts'
import * as objects from './objects.ts'
import { ModelCode } from '../../../../game/maze/physical/models.ts'

export const GeometrySpecDict: Record<ModelCode, GeometrySpec> = {
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
