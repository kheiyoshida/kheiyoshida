import type { RenderBlockPosition } from '../scaffold'
import { Grid, RenderGrid } from '../../../domain/query'

export type UnitSpec = {
  codes: GeometryCode[]
  position: RenderBlockPosition
}

export type GeometryRenderingSpec = {
  grid: GeometryCodeGrid
  altGrid?: AltGeometryCodeGrid[]
}

/**
 * converts render grid into layers of geometry codes
 */
export type GeometryCodeConverter = (renderGrid: RenderGrid) => GeometryRenderingSpec

export type AltGeometryCodeGrid = {
  yLayerOffset?: number
  grid: GeometryCodeGrid
}

export type GeometryCodeGrid = Grid<GeometryCode[], GeometryCode[]>

/**
 * represents which geometry to render
 */
export type GeometryCode =
  | 'Floor'
  | 'Ceil'
  | 'RightWall'
  | 'LeftWall'
  | 'FrontWall'
  | 'Octahedron'
  | 'Pole'
  | 'Tile'
  | 'LowerTile'
  | 'StairTile'
  | 'StairCeil'
  | 'StairSteps'
  | 'StairRightWall'
  | 'StairLeftWall'
  | 'StairCorridorRightWall'
  | 'StairCorridorLeftWall'
  | 'StairCorridorCeil'
  | 'StairCorridorFloor'
