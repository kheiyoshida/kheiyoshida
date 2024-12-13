import type { RenderBlockPosition } from '../scaffold'
import { RenderGrid } from '../../../domain/query/structure/renderGrid/renderSpec.ts'

export type UnitSpec = {
  codes: GeometryCode[]
  position: RenderBlockPosition
}

/**
 * converts render grid into layers of geometry codes
 */
export type GeometryCodeConverter = (renderGrid: RenderGrid) => GeometryCodeGrid

export type GeometryCodeGrid = GeometryCodeGridLayer[]
export type GeometryCodeGridLayer = [GeometryCode[], GeometryCode[], GeometryCode[]]

/**
 * represents which geometry to render
 */
export enum GeometryCode {
  Floor = 'Floor',
  Ceil = 'Ceil',
  RightWall = 'RightWall',
  LeftWall = 'LeftWall',
  FrontWall = 'FrontWall',
  Octahedron = 'Octahedron',
  Pole = 'Pole',
  Tile = 'Tile',
}
