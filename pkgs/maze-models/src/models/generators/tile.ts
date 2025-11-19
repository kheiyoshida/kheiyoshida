import { GeometrySpec, Vector3D } from '../../pipeline/types'

export type TileParams = {
  radiusBase: number
  radiusDelta: number
  numOfCorners: number
  thicknessBase: number
  thicknessDelta: number
}

export const generateTileGeometry = (params: TileParams): GeometrySpec => {
  // prepare vertices for the top and bottom faces
  const angle = (Math.PI * 2) / params.numOfCorners

  const radius = () => params.radiusBase + params.radiusDelta * (Math.random() - 0.5)

  const topY = 1
  const topCenter: Vector3D = [0, topY, 0]
  const topVertices: Vector3D[] = []
  for (let i = 0; i < params.numOfCorners; i++) {
    const r = radius()
    const x = Math.cos(angle * i) * r
    const z = -Math.sin(angle * i) * r
    topVertices.push([x, topY, z])
  }

  const thickness = () => params.thicknessBase + params.thicknessDelta * (Math.random() - 0.5)
  const bottomY = 1 - thickness()
  const bottomCenter: Vector3D = [0, bottomY, 0]
  const bottomVertices: Vector3D[] = []
  for (let i = 0; i < params.numOfCorners; i++) {
    const r = radius()
    const x = Math.cos(angle * i) *  r
    const z = -Math.sin(angle * i) * r
    bottomVertices.push([x, 1 - thickness(), z])
  }

  const vertices: Vector3D[] = [topCenter, ...topVertices, bottomCenter, ...bottomVertices]

  // connect vertices to form triangles on top, side, bottom
  const topCenterIndex = 0
  const topStart = 1
  const n = params.numOfCorners
  const bottomCenterIndex = n + 1
  const bottomStart = n + 2
  const faces: { vertexIndices: number[]; normalIndices: number[] }[] = []

  // top face triangles (triangle fan)
  for (let i = 0; i < n; i++) {
    faces.push({
      vertexIndices: [topCenterIndex, topStart + i, topStart + ((i + 1) % n)],
      normalIndices: [0, 0, 0],
    })
  }

  // bottom face triangles (reverse winding)
  for (let i = 0; i < n; i++) {
    faces.push({
      vertexIndices: [bottomCenterIndex, bottomStart + ((i + 1) % n), bottomStart + i],
      normalIndices: [0, 0, 0],
    })
  }

  // side walls
  for (let i = 0; i < n; i++) {
    const t0 = topStart + i
    const t1 = topStart + ((i + 1) % n)
    const b0 = bottomStart + i
    const b1 = bottomStart + ((i + 1) % n)

    faces.push({ vertexIndices: [t0, b0, t1], normalIndices: [0, 0, 0] })
    faces.push({ vertexIndices: [t1, b0, b1], normalIndices: [0, 0, 0] })
  }

  return {
    vertices,
    normals: [],
    faces,
  }
}
