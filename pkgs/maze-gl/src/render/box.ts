import { DeformedBox, DeformedBoxNormals, Vector } from '../models'
import { vec3 } from 'gl-matrix'

// TODO: stick to use vec3 or Vector. Don't mix.
// TODO: prefer index enums over named key for deformed box

// Calculate normals that point from the center to each vertex
export function computeOutwardNormals(deformedBlock: DeformedBox): DeformedBoxNormals {
  const vectors: vec3[] = Object.values(deformedBlock).map(v => v)
  const center: Vector = computeCenter(vectors) as Vector;

  return {
    normalFBL: sub(deformedBlock.FBL, center),
    normalFBR: sub(deformedBlock.FBR, center),
    normalFTL: sub(deformedBlock.FTL, center),
    normalFTR: sub(deformedBlock.FTR, center),
    normalBBL: sub(deformedBlock.BBL, center),
    normalBBR: sub(deformedBlock.BBR, center),
    normalBTL: sub(deformedBlock.BTL, center),
    normalBTR: sub(deformedBlock.BTR, center),
  };
}

// Compute the center of the box
function computeCenter(points: vec3[]): vec3 {
  const center = vec3.create();
  for (const point of points) {
    vec3.add(center, center, point);
  }
  return vec3.scale(center, center, 1 / points.length);
}


function sub(a: Vector, b: Vector):Vector {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2], ]
}
