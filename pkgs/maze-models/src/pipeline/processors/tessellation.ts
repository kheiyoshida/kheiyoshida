import { GeometrySpec, Vector3D } from '../types'

/**
 * Adds intermediate vertices for higher mesh resolution.
 * Should respect existing vertex positions and interpolate
 * interior points randomly within the face.
 */
export const tesselateGeometry =
  (insertionsPerFace: number) =>
  (input: GeometrySpec): GeometrySpec => {
    const vertices = input.vertices.slice()
    for (const face of input.faces) {
      const v0 = vertices[face.vertexIndices[0]]
      const v1 = vertices[face.vertexIndices[1]]
      const v2 = vertices[face.vertexIndices[2]]
      for (let i = 0; i < insertionsPerFace; i++) {
        vertices.push(randomPointOnFace(v0, v1, v2))

        // mutate directly for now, maybe make this pure later
        face.vertexIndices.push(vertices.length - 1)
        face.normalIndices.push(face.normalIndices[0]) // duplicate for now
      }
    }

    return {
      ...input,
      vertices,
      meta: { ...input.meta, stage: 'tessellated' },
    }
  }

export function randomPointOnFace(v0: Vector3D, v1: Vector3D, v2: Vector3D): Vector3D {
  let r1 = Math.random()
  let r2 = Math.random()
  if (r1 + r2 > 1) {
    r1 = 1 - r1
    r2 = 1 - r2
  }
  return [
    v0[0] + r1 * (v1[0] - v0[0]) + r2 * (v2[0] - v0[0]),
    v0[1] + r1 * (v1[1] - v0[1]) + r2 * (v2[1] - v0[1]),
    v0[2] + r1 * (v1[2] - v0[2]) + r2 * (v2[2] - v0[2]),
  ]
}
