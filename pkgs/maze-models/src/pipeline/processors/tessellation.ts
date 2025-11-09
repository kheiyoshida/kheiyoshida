import { GeometrySpec } from '../types'

/**
 * Adds intermediate vertices for higher mesh resolution.
 * Should respect existing vertex positions and interpolate
 * interior points (grid or random scatter).
 */
export function tesselateGeometry(input: GeometrySpec): GeometrySpec {
  // TODO: Implement per-face subdivision (grid or Delaunay scatter)
  return {
    ...input,
    meta: { ...input.meta, stage: 'tessellated' },
  }
}
