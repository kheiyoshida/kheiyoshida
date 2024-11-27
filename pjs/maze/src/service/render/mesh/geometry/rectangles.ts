import { GeometrySpec, Vec3 } from 'maze-gl'
import { Vector3D } from 'maze-gl'

const FBL: Vector3D = [-1, -1, 1] // front-bottom-left
const FBR: Vector3D = [1, -1, 1] // front-bottom-right
const FTL: Vector3D = [-1, 1, 1] // front-top-left
const FTR: Vector3D = [1, 1, 1] // front-top-right
const BBL: Vector3D = [-1, -1, -1] // back-bottom-left
const BBR: Vector3D = [1, -1, -1] // back-bottom-right
const BTL: Vector3D = [-1, 1, -1] // back-top-left
const BTR: Vector3D = [1, 1, -1] // back-top-right

const NUp: Vector3D = [0, 1, 0]
const NDown: Vector3D = [0, -1, 0]
const NRight: Vector3D = [1, 0, 0]
const NLeft: Vector3D = [-1, 0, 0]
const NFront: Vector3D = [0, 0, 1]

// note: we work with right-hand coordinate system in WebGL.
// face triangle should be drawing edges in clock-wise direction when seen

export const completeRectSpec = ({ normals, vertices }: Omit<GeometrySpec, 'faces'>): GeometrySpec => ({
  faces: [
    {
      vertexIndices: [0, 1, 4],
      normalIndices: [0, 0, 0],
    },
    {
      vertexIndices: [1, 2, 4],
      normalIndices: [0, 0, 0],
    },
    {
      vertexIndices: [2, 3, 4],
      normalIndices: [0, 0, 0],
    },
    {
      vertexIndices: [3, 0, 4],
      normalIndices: [0, 0, 0],
    },
  ],
  normals,
  vertices: [...vertices, Vec3.avg(...vertices)],
})

//
// specs below are seen from the "inside" of the box
//
export const Ceil = completeRectSpec({
  normals: [NDown],
  vertices: [FTL, FTR, BTR, BTL],
})

export const Floor = completeRectSpec({
  normals: [NUp],
  vertices: [FBR, FBL, BBL, BBR],
})

//
// specs below are seen from the "outside" of the box
//

export const FrontWall = completeRectSpec({
  normals: [NFront],
  vertices: [FBR, FBL, FTL, FTR],
})

export const RightWall = completeRectSpec({
  normals: [NLeft],
  vertices: [FBL, BBL, BTL, FTL],
})

export const LeftWall = completeRectSpec({
  normals: [NRight],
  vertices: [FBR, FTR, BTR, BBR],
})
