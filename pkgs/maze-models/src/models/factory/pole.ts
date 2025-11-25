import { GeometrySpec, Vector3D } from '../../pipeline/types'

export type PoleGeometryParams = {
  type: 'pole' | 'floor' | 'wall'
  radiusBase: number
  radiusDelta: number
  numOfCorners: number
  heightBase: number
  heightDelta: number
  heightPerSegment: number
  segmentYDelta: number
}

const generateCircle =
  (numOfCorners: number, getRadius: () => number) =>
  (getY: () => number): Vector3D[] => {
    const vertices: Vector3D[] = []
    const angle = (Math.PI * 2) / numOfCorners
    for (let i = 0; i < numOfCorners; i++) {
      const r = getRadius()
      const x = Math.cos(angle * i) * r
      const z = -Math.sin(angle * i) * r
      vertices.push([x, getY(), z])
    }
    return vertices
  }

export const poleGeometryFactory = (params: PoleGeometryParams): GeometrySpec => {
  // determine segments first
  const height = params.heightBase + params.heightDelta * (Math.random() - 0.5)
  const numOfSegments = Math.round(height / params.heightPerSegment)
  const heightPerSegment = height / numOfSegments
  const topY = -1 + height

  const radius = () => params.radiusBase + params.radiusDelta * (Math.random() - 0.5)
  const genCircle = generateCircle(params.numOfCorners, radius)

  // generate vertices for each slice
  const vertices: Vector3D[] = []
  for (let i = 0; i <= numOfSegments; i++) {
    const getY = () => topY - heightPerSegment * i + params.segmentYDelta * (Math.random() - 0.5)
    vertices.push(...genCircle(getY))
  }

  // connect side faces
  const faces: { vertexIndices: number[]; normalIndices: number[] }[] = []
  const n = params.numOfCorners
  for (let i = 0; i < numOfSegments; i++) {
    const topStart = i * n
    const bottomStart = (i + 1) * n

    for (let j = 0; j < n; j++) {
      const t0 = topStart + j
      const t1 = topStart + ((j + 1) % n)
      const b0 = bottomStart + j
      const b1 = bottomStart + ((j + 1) % n)
      faces.push({ vertexIndices: [t0, b0, t1], normalIndices: [0, 0, 0] })
      faces.push({ vertexIndices: [t1, b0, b1], normalIndices: [0, 0, 0] })
    }
  }

  // connect top and bottom faces
  vertices.push([0, topY, 0])
  vertices.push([0, topY - heightPerSegment * numOfSegments, 0])
  const topCenterIndex = vertices.length - 2
  const bottomCenterIndex = vertices.length - 1

  for (let i = 0; i < n; i++) {
    faces.push({
      vertexIndices: [topCenterIndex, i, (i + 1) % n],
      normalIndices: [0, 0, 0],
    })
  }

  const bottomStart = numOfSegments * n
  for (let i = 0; i < n; i++) {
    faces.push({
      vertexIndices: [bottomCenterIndex, bottomStart + i, bottomStart + ((i + 1) % n)],
      normalIndices: [0, 0, 0],
    })
  }

  return {
    vertices,
    normals: [[0, 0, 0]],
    faces,
  }
}
