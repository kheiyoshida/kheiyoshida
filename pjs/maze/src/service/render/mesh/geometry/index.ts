import { GeometryCode } from '../../unit'
import { GeometrySpec } from 'maze-gl'
import * as rectangles from './rectangles.ts'
import * as objects from './objects.ts'

export const GeometrySpecDict: Record<GeometryCode, GeometrySpec> = {
  Ceil: rectangles.Ceil,
  Floor: rectangles.Floor,
  FrontWall: rectangles.FrontWall,
  LeftWall: rectangles.LeftWall,
  RightWall: rectangles.RightWall,
  Octahedron: objects.Octahedron,
  Pole: objects.Pole,
  Tile: objects.Tile,
  StairTile: objects.Tile,
  LowerTile: objects.LowerTile,
  StairCeil: rectangles.StairCeil,
  StairSteps: rectangles.StairSteps,
  StairRightWall: rectangles.StairRightWall,
  StairLeftWall: rectangles.StairLeftWall,
  StairCorridorRightWall: rectangles.StairCorridorRightWall,
  StairCorridorLeftWall: rectangles.StairCorridorLeftWall,
  StairCorridorCeil: rectangles.StairCorridorCeil,
  StairCorridorFloor: rectangles.StairCorridorFloor,
}
