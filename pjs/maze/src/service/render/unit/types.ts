import type { RenderBlockPosition } from '../scaffold'

export type UnitSpec = {
  codes: GeometryCode[]
  position: RenderBlockPosition
}

export type GeometryCodeGrid = GeometryCodeGridLayer[]
export type GeometryCodeGridLayer = [GeometryCode[], GeometryCode[], GeometryCode[]]

/**
 * Code to represent which geometry to render.
 * Since there can be multiple meshes for a geometry,
 * it is not a unique key
 */
export enum GeometryCode {
  Floor = 'Floor',
  Ceil = 'Ceil',
  RightWall = 'RightWall',
  LeftWall = 'LeftWall',
  FrontWall = 'FrontWall',
  Stair = 'Stair',
}
