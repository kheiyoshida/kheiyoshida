import { GeometrySpec, Vector3D } from '../../pipeline/types'

export type TileParams = {
  radiusBase: number
  radiusDelta: number
  numOfCorners: number
  thicknessBase: number
  thicknessDelta: number
}

const generateCircle = (numOfCorners: number, getRadius: () => number) => (getY: () => number): Vector3D[] => {
  const center: Vector3D = [0, getY(), 0]
  const vertices: Vector3D[] = [center]

  const angle = (Math.PI * 2) / numOfCorners
  for (let i = 0; i < numOfCorners; i++) {
    const r = getRadius()
    const x = Math.cos(angle * i) * r
    const z = -Math.sin(angle * i) * r
    vertices.push([x, getY(), z])
  }
  return vertices
}

export const tileGeometryFactory = (params: TileParams): GeometrySpec => {
  // prepare vertices for the top and bottom faces

  const radius = () => params.radiusBase + params.radiusDelta * (Math.random() - 0.5)

  const genCircle = generateCircle(params.numOfCorners, radius)

  const topVertices: Vector3D[] = genCircle(() => 1)

  const thickness = () => params.thicknessBase + params.thicknessDelta * (Math.random() - 0.5)
  const getY = () => 1 - thickness()
  const bottomVertices: Vector3D[] = genCircle(getY)

  const vertices: Vector3D[] = [...topVertices, ...bottomVertices]

  // connect vertices to form triangles on top, side, bottom
  const topCenterIndex = 0
  const topStart = 1
  const n = params.numOfCorners

  const faces: { vertexIndices: number[]; normalIndices: number[] }[] = []

  // top face triangles (triangle fan)
  for (let i = 0; i < n; i++) {
    faces.push({
      vertexIndices: [topCenterIndex, topStart + i, topStart + ((i + 1) % n)],
      normalIndices: [0, 0, 0],
    })
  }

  const bottomCenterIndex = (n + 1)
  const bottomStart = bottomCenterIndex + 1

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
