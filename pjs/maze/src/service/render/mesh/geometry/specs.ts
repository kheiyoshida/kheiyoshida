import { GeometrySpec, Vector } from 'maze-gl'

const FBL: Vector = [-1, -1, 1] // front-bottom-left
const FBR: Vector = [1, -1, 1] // front-bottom-right
const FTL: Vector = [-1, 1, 1] // front-top-left
const FTR: Vector = [1, 1, 1] // front-top-right
const BBL: Vector = [-1, -1, -1] // back-bottom-left
const BBR: Vector = [1, -1, -1] // back-bottom-right
const BTL: Vector = [-1, 1, -1] // back-top-left
const BTR: Vector = [1, 1, -1] // back-top-right

const NUp: Vector = [0, 1, 0]
const NDown: Vector = [0, -1, 0]
const NRight: Vector = [1, 0, 0]
const NLeft: Vector = [-1, 0, 0]
const NFront: Vector = [0, 0, 1]

const completeSpec = ({ normals, vertices }: Omit<GeometrySpec, 'faces'>): GeometrySpec => ({
  faces: [
    {
      vertexIndices: [0, 1, 2],
      normalIndices: [0, 0, 0],
    },
    {
      vertexIndices: [2, 3, 0],
      normalIndices: [0, 0, 0],
    },
  ],
  normals,
  vertices,
})

// note: we work with right-hand coordinate system in WebGL.
// face triangle should be drawing edges in clock-wise direction when seen

//
// specs below are seen from the "inside" of the box
//
export const Ceil = completeSpec({
  normals: [NDown],
  vertices: [FTL, FTR, BTR, BTL],
})

export const Floor = completeSpec({
  normals: [NUp],
  vertices: [FBR, FBL, BBL, BBR],
})

//
// specs below are seen from the "outside" of the box
//

export const FrontWall = completeSpec({
  normals: [NFront],
  vertices: [FBR, FBL, FTL, FTR],
})

export const RightWall = completeSpec({
  normals: [NLeft],
  vertices: [FBL, BBL, BTL, FTL],
})

export const LeftWall = completeSpec({
  normals: [NRight],
  vertices: [FBR, FTR, BTR, BBR],
})
