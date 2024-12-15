import { GeometrySpec, TriangleIndexData, Vector3D } from 'maze-gl'

// Bottom
const FrontBottomMiddle: Vector3D = [0, -1, 1]
const BackBottomMiddle: Vector3D = [0, -1, -1]
const RightBottomMiddle: Vector3D = [1, -1, 0]
const LeftBottomMiddle: Vector3D = [-1, -1, 0]

// Top
const FrontTopMiddle: Vector3D = [0, 5, 1]
const BackTopMiddle: Vector3D = [0, 5, -1]
const RightTopMiddle: Vector3D = [1, 5, 0]
const LeftTopMiddle: Vector3D = [-1, 5, 0]

const NRightFront: Vector3D = [1, 0, 1]
const NLeftFront: Vector3D = [-1, 0, 1]
const NRightBack: Vector3D = [1, 0, -1]
const NLeftBack: Vector3D = [-1, 0, -1]

const rectToTriangles = (
  vertexIndices: [number, number, number, number],
  normalIndex: number
): TriangleIndexData[] => {
  return [
    {
      vertexIndices: [vertexIndices[0], vertexIndices[1], vertexIndices[2]],
      normalIndices: Array(3).fill(normalIndex),
    },
    {
      vertexIndices: [vertexIndices[2], vertexIndices[3], vertexIndices[0]],
      normalIndices: Array(3).fill(normalIndex),
    },
  ]
}

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
    ...rectToTriangles([0, 2, 6, 4], 0),
    // left-front
    ...rectToTriangles([0, 3, 7, 4], 1),
    // right-back
    ...rectToTriangles([2, 1, 5, 6], 2),
    // left-back
    ...rectToTriangles([3, 1, 5, 7], 3),
  ],
}

const LowFrontBottomMiddle: Vector3D = [0, -0.8, 1]
const LowBackBottomMiddle: Vector3D = [0, -0.8, -1]
const LowRightBottomMiddle: Vector3D = [1, -0.8, 0]
const LowLeftBottomMiddle: Vector3D = [-1, -0.8, 0]

const LowerFrontBottomMiddle: Vector3D = [0, -1, 1]
const LowerBackBottomMiddle: Vector3D = [0, -1, -1]
const LowerRightBottomMiddle: Vector3D = [1, -1, 0]
const LowerLeftBottomMiddle: Vector3D = [-1, -1, 0]

const NTop: Vector3D = [0, 1, 0]

export const Tile: GeometrySpec = {
  vertices: [
    LowerFrontBottomMiddle,
    LowerBackBottomMiddle,
    LowerRightBottomMiddle,
    LowerLeftBottomMiddle,
    LowFrontBottomMiddle,
    LowBackBottomMiddle,
    LowRightBottomMiddle,
    LowLeftBottomMiddle,
  ],
  normals: [NRightFront, NLeftFront, NRightBack, NLeftBack, NTop],
  faces: [
    // right-front
    ...rectToTriangles([0, 2, 6, 4], 0),
    // left-front
    ...rectToTriangles([0, 3, 7, 4], 1),
    // right-back
    ...rectToTriangles([2, 1, 5, 6], 2),
    // left-back
    ...rectToTriangles([3, 1, 5, 7], 3),
    // top
    ...rectToTriangles([4, 6, 5, 7], 4),
  ],
}

const yLayerDown = ([x, y, z]: Vector3D): Vector3D => [x, y - 4, z] // down by 2 floors
export const LowerTile: GeometrySpec = {
  ...Tile,
  vertices: Tile.vertices.map(yLayerDown),
}

export const StairTile: GeometrySpec = {
  ...Tile,
  vertices: Tile.vertices.map(([x, y, z]) => [x, y + 2, z]),
}

// Middle
const FrontMiddleMiddle: Vector3D = [0, 0, 1]
const BackMiddleMiddle: Vector3D = [0, 0, -1]
const RightMiddleMiddle: Vector3D = [1, 0, 0]
const LeftMiddleMiddle: Vector3D = [-1, 0, 0]
const TopCenter: Vector3D = [0, 1, 0]
const BottomCenter: Vector3D = [0, -1, 0]

const NFrontRightBottom: Vector3D = [1, -1, 1]
const NFrontLeftBottom: Vector3D = [-1, -1, 1]
const NFrontRightTop: Vector3D = [1, 1, 1]
const NFrontLeftTop: Vector3D = [-1, 1, 1]

const NBackRightBottom: Vector3D = [1, -1, -1]
const NBackLeftBottom: Vector3D = [-1, -1, -1]
const NBackRightTop: Vector3D = [1, 1, -1]
const NBackLeftTop: Vector3D = [-1, 1, -1]

export const Octahedron: GeometrySpec = {
  vertices: [
    FrontMiddleMiddle, // 0
    BackMiddleMiddle, // 1
    RightMiddleMiddle, // 2
    LeftMiddleMiddle, // 3
    TopCenter, // 4
    BottomCenter, // 5
  ],
  normals: [
    NFrontRightBottom,
    NFrontLeftBottom,
    NFrontRightTop,
    NFrontLeftTop,
    NBackRightBottom,
    NBackLeftBottom,
    NBackRightTop,
    NBackLeftTop,
  ],
  faces: [
    {
      vertexIndices: [5, 2, 0],
      normalIndices: Array(3).fill(0),
    },
    {
      vertexIndices: [5, 0, 3],
      normalIndices: Array(3).fill(1),
    },
    {
      vertexIndices: [4, 0, 2],
      normalIndices: Array(3).fill(2),
    },
    {
      vertexIndices: [4, 3, 0],
      normalIndices: Array(3).fill(3),
    },
    {
      vertexIndices: [5, 1, 2],
      normalIndices: Array(3).fill(4),
    },
    {
      vertexIndices: [5, 3, 1],
      normalIndices: Array(3).fill(5),
    },
    {
      vertexIndices: [4, 1, 2],
      normalIndices: Array(3).fill(6),
    },
    {
      vertexIndices: [4, 3, 1],
      normalIndices: Array(3).fill(7),
    },
  ],
}
