import { GeometrySpec, Index, TriangleIndexData, Vector3D } from '../types'

export const parseObjData = (objText: string): GeometrySpec => {
  const vertices: Vector[] = []
  const normals: Vector[] = []
  const faces: TriangleIndexData[] = []

  // Split text by lines and iterate over each line
  const lines = objText.split('\n')
  for (const line of lines) {
    const parts = line.trim().split(/\s+/)
    const prefix = parts[0]

    if (prefix === 'v') {
      const x = parseFloat(parts[1])
      const y = parseFloat(parts[2])
      const z = parseFloat(parts[3])
      vertices.push([x, y, z])
    } else if (prefix === 'vn') {
      const nx = parseFloat(parts[1])
      const ny = parseFloat(parts[2])
      const nz = parseFloat(parts[3])
      normals.push([nx, ny, nz])
    } else if (prefix === 'u') {
      // TODO: add uv handling
    } else if (prefix === 'f') {
      const vertices: Index[] = []
      const normals: Index[] = []
      parts.slice(1).forEach((part) => {
        const indices = part.split('/')
        const vIndex = parseInt(indices[0]) - 1
        const nIndex = parseInt(indices[2]) - 1
        if (vIndex === undefined || nIndex === undefined) throw new Error('invalid parameter')
        vertices.push(vIndex)
        normals.push(nIndex)
      })
      if (vertices.length === 3) {
        faces.push({
          vertexIndices: vertices,
          normalIndices: normals,
        })
      } else if (vertices.length === 4) {
        faces.push({
          vertexIndices: [vertices[0], vertices[1], vertices[2]],
          normalIndices: [normals[0], normals[1], normals[2]],
        })
        faces.push({
          vertexIndices: [vertices[0], vertices[2], vertices[3]],
          normalIndices: [normals[0], normals[2], normals[3]],
        })
      } else {
        throw Error(`unsupported length face`)
      }
    }
  }
  return { vertices, normals, faces }
}
