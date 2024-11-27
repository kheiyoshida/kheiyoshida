import { GeometrySpec, Vector3D } from 'maze-gl'

const FrontBottomMiddle: Vector3D = [0, -1, 1]
const BackBottomMiddle: Vector3D = [0, -1, -1]
const RightBottomMiddle: Vector3D = [1, -1, 0]
const LeftBottomMiddle: Vector3D = [-1, -1, 0]
const FrontTopMiddle: Vector3D = [0, 3, 1]
const BackTopMiddle: Vector3D = [0, 3, -1]
const RightTopMiddle: Vector3D = [1, 3, 0]
const LeftTopMiddle: Vector3D = [-1, 3, 0]

const NRightFront: Vector3D = [1, 0, 1]
const NLeftFront: Vector3D = [-1, 0, 1]
const NRightBack: Vector3D = [1, 0, -1]
const NLeftBack: Vector3D = [-1, 0, -1]

export const Pole: GeometrySpec = {
  vertices: [
    FrontBottomMiddle, // 0
    BackBottomMiddle, // 1
    RightBottomMiddle, // 2
    LeftBottomMiddle, // 3
    FrontTopMiddle, // 4
    BackTopMiddle, // 5
    RightTopMiddle, // 6
    LeftTopMiddle, // 7
  ],
  normals: [NRightFront, NLeftFront, NRightBack, NLeftBack],
  faces: [
    // right-front
    {
      vertexIndices: [0, 2, 6, 4],
      normalIndices: Array(4).fill(0),
    },
    // left-front
    {
      vertexIndices: [0, 3, 7, 4],
      normalIndices: Array(4).fill(1),
    },
    // right-back
    {
      vertexIndices: [2, 1, 5, 6],
      normalIndices: Array(4).fill(2),
    },
    // left-back
    {
      vertexIndices: [3, 1, 5, 7],
      normalIndices: Array(4).fill(3),
    },
    // bottom
    {
      vertexIndices: [0, 3, 1, 2],
      normalIndices: Array(4).fill(3),
    }
  ],
}
