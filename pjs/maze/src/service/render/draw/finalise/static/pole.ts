import { Geometry } from 'p5'
import { Position3D } from 'p5utils/src/3d'
import { FloorPathAvgLength, WallHeight } from '../../../../../config'
import { finalizeGeometries } from '../geometry/finalize'
import { GeometrySpec } from '../geometry/types'



export const createPole = (w = FloorPathAvgLength / 3, h = WallHeight * 2): Geometry[] => {
  const p1: Position3D = [w, 0, 0]
  const p2: Position3D = [0, 0, w]
  const p3: Position3D = [-w, 0, 0]
  const p4: Position3D = [0, 0, -w]

  const p5: Position3D = [w, -h, 0]
  const p6: Position3D = [0, -h, w]
  const p7: Position3D = [-w, -h, 0]
  const p8: Position3D = [0, -h, -w]

  const face1: GeometrySpec = {
    coords: [p1, p2, p6, p5],
    normalPosition: [w, -h / 2, w],
  }
  const face2: GeometrySpec = {
    coords: [p2, p3, p7, p6],
    normalPosition: [-w, -h / 2, w],
  }
  const face3: GeometrySpec = {
    coords: [p3, p4, p8, p7],
    normalPosition: [-w, -h / 2, -w],
  }
  const face4: GeometrySpec = {
    coords: [p4, p1, p5, p8],
    normalPosition: [w, -h / 2, -w],
  }

  return finalizeGeometries([face1, face2, face3, face4])
}

export const createTile = (w = FloorPathAvgLength/2, h = WallHeight / 5): Geometry[] => {
  const p1: Position3D = [w, 0, 0]
  const p2: Position3D = [0, 0, w]
  const p3: Position3D = [-w, 0, 0]
  const p4: Position3D = [0, 0, -w]

  const p5: Position3D = [w, h, 0]
  const p6: Position3D = [0, h, w]
  const p7: Position3D = [-w, h, 0]
  const p8: Position3D = [0, h, -w]

  const topFace: GeometrySpec = {
    coords: [p1, p2, p3, p4],
    normalPosition: [0, -100, 0],
  }
  const face1: GeometrySpec = {
    coords: [p1, p2, p6, p5],
    normalPosition: [w, h / 2, w],
  }
  const face2: GeometrySpec = {
    coords: [p2, p3, p7, p6],
    normalPosition: [-w, h / 2, w],
  }
  const face3: GeometrySpec = {
    coords: [p3, p4, p8, p7],
    normalPosition: [-w, h / 2, -w],
  }
  const face4: GeometrySpec = {
    coords: [p4, p1, p5, p8],
    normalPosition: [w, h / 2, -w],
  }

  return finalizeGeometries([topFace, face1, face2, face3, face4])
}
