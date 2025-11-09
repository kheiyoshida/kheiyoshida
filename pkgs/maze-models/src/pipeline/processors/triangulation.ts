import { GeometrySpec } from '../types'

/**
 * Given vertices (possibly unordered within each face),
 * produces explicit triangles via triangulation.
 * For imported OBJ meshes, this may be a no-op.
 */
export function triangulateFaces(input: GeometrySpec): GeometrySpec {
  // TODO: Apply Delaunay triangulation on face vertices if needed
  return {
    ...input,
    meta: { ...input.meta, stage: 'triangulated' },
  }
}
