import { DeformedBox, DeformedBoxNormals } from '../models'
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
  return center;
}

