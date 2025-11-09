import { GeometrySpec, Vector3D } from '../types'

/**
 * Deduplicates coincident vertices and remaps face indices.
 */
export function weldVertices(input: GeometrySpec, epsilon = 1e-6): GeometrySpec {
  const map = new Map<string, number>()
  const newVertices: Vector3D[] = []
  const remap: number[] = []

  for (let i = 0; i < input.vertices.length; i++) {
    const v = input.vertices[i]
    const key = `${v[0].toFixed(6)},${v[1].toFixed(6)},${v[2].toFixed(6)}`
    if (map.has(key)) {
      remap[i] = map.get(key)!
    } else {
      const newIndex = newVertices.length
      map.set(key, newIndex)
      newVertices.push(v)
      remap[i] = newIndex
    }
  }

  const faces = input.faces.map(f => ({
    ...f,
    vertexIndices: f.vertexIndices.map(i => remap[i]),
  }))

  return {
    ...input,
    vertices: newVertices,
    faces,
    meta: { ...input.meta, stage: 'welded' },
  }
}
