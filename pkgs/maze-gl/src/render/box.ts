import { DeformedBox, DeformedBoxNormals, DeformedBoxNormalsV2 } from '../models'
import { Vec3, Vector3D } from '../vector'

// Calculate normals that point from the center to each vertex
export function computeOutwardNormals(deformedBlock: DeformedBox): DeformedBoxNormals {
  const vectors: Vector3D[] = Object.values(deformedBlock).map((v) => v)
  const center: Vector3D = computeCenter(vectors) as Vector3D

  return {
    normalFBL: Vec3.sub(deformedBlock.FBL, center),
    normalFBR: Vec3.sub(deformedBlock.FBR, center),
    normalFTL: Vec3.sub(deformedBlock.FTL, center),
    normalFTR: Vec3.sub(deformedBlock.FTR, center),
    normalBBL: Vec3.sub(deformedBlock.BBL, center),
    normalBBR: Vec3.sub(deformedBlock.BBR, center),
    normalBTL: Vec3.sub(deformedBlock.BTL, center),
    normalBTR: Vec3.sub(deformedBlock.BTR, center),
  }
}

// Compute the center of the box
function computeCenter(points: Vector3D[]): Vector3D {
  const center = Vec3.create()
  for (const point of points) {
    Vec3.add(center, point)
  }
  void Vec3.scale(center, 1 / points.length)
  return center
}

/**
 * calculate box face's normal
 * @param points points of the face in counterclockwise order (seen from the point outside the box)
 * @return normal vector (not normalized, not a unit vector)
 */
export const calcFaceNormal = (...points: Vector3D[]): Vector3D => {
  if (points.length > 4 || points.length < 2) throw Error(`too many or too few points`)
  if (points.length === 4) {
    const normal1 = calcFaceNormal(points[0], points[1], points[2])
    const normal2 = calcFaceNormal(points[2], points[3], points[0])
    return Vec3.mix(normal1, normal2, 0.5)
  }
  const [p1, p2, p3] = points
  return Vec3.cross(
    Vec3.sub(p2, p1), // vector p1->p2
    Vec3.sub(p3, p2) // vector p2->p3
  )
}

/**
 * calculate face normals for 6 faces of the given box
 */
export const calcFaceNormalsOfBox = (deformedBox: DeformedBox): DeformedBoxNormalsV2 => {
  return {
    normalTop: calcFaceNormal(deformedBox.FTR, deformedBox.BTR, deformedBox.BTL, deformedBox.FTL),
    normalBottom: calcFaceNormal(deformedBox.FBR, deformedBox.FBL, deformedBox.BBL, deformedBox.BBR),
    normalRight: calcFaceNormal(deformedBox.FTR, deformedBox.FBR, deformedBox.BBR, deformedBox.BTR),
    normalLeft: calcFaceNormal(deformedBox.FTL, deformedBox.BTL, deformedBox.BBL, deformedBox.FBL),
    normalFront: calcFaceNormal(deformedBox.FTL, deformedBox.FBL, deformedBox.FBR, deformedBox.FTR),
    normalBack: calcFaceNormal(deformedBox.BTL, deformedBox.BTR, deformedBox.BBR, deformedBox.BBL),
  }
}

/**
 * get a normal for a vertex within a deformed box
 *
 * it blends the normals based off each face's distance to the vertex
 *
 * implemented in TS for testing, but will be implemented & used in vertex shader in production
 */
export const blendBoxNormalsForAVertex = (
  vertex: Vector3D,
  box: DeformedBox,
  boxNormals: DeformedBoxNormalsV2
): Vector3D => {
  const closeFaceNormals: Vector3D[] = []
  const closeFaceDistances: number[] = []

  const collectCloseFace = (vertex: Vector3D, facePoint: Vector3D, faceNormal: Vector3D): void => {
    const vectorToPoint = Vec3.sub(facePoint, vertex)
    const dist = Math.abs(Vec3.dot(faceNormal, vectorToPoint))
    closeFaceNormals.push(faceNormal)
    closeFaceDistances.push(dist + 1e-6)
  }

  collectCloseFace(vertex, box.FTR, boxNormals.normalTop)
  collectCloseFace(vertex, box.FBR, boxNormals.normalBottom)
  collectCloseFace(vertex, box.FTR, boxNormals.normalRight)
  collectCloseFace(vertex, box.FTL, boxNormals.normalLeft)
  collectCloseFace(vertex, box.FTL, boxNormals.normalFront)
  collectCloseFace(vertex, box.BTL, boxNormals.normalBack)

  const distSum = closeFaceDistances.reduce((a, b) => a + b, 0)
  const result = Vec3.create()
  for (let i = 0; i < closeFaceNormals.length; i++) {
    const normal = closeFaceNormals[i]
    const dist = closeFaceDistances[i]
    Vec3.add(result, Vec3.createScaled(normal, distSum / dist))
  }

  Vec3.normalize(result, 1)
  return result;
}
