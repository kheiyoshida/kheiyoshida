import { GeometrySpec, TriangleIndexData, Vector3D } from '../types'

/**
 * Merges multiple face-based GeometrySpec objects into one.
 */
export function mergeGeometry(input: GeometrySpec): GeometrySpec {
  // TODO: If you’re assembling from multiple parts, flatten vertices/faces here.
  // For single meshes, this may simply pass through.
  return {
    ...input,
    meta: { ...input.meta, stage: 'merged' },
  }
}
