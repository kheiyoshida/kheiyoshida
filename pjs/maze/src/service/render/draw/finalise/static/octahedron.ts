import { Geometry } from 'p5'
import { averagePosition3ds } from 'p5utils/src/3d'
import { RenderBlockCoords } from '../../scaffold'
import { Position3D } from 'p5utils/src/3d'
import { StaticModelEmitter } from '.'
import { FloorPathAvgLength } from '../../../../../config'
import { finalizeGeometries } from '../geometry/finalize'
import { GeometrySpec } from '../geometry/types'

export const createOcta = (w = FloorPathAvgLength / 2, h = FloorPathAvgLength / 2): Geometry[] => {
  const p1: Position3D = [w, 0, 0]
  const p2: Position3D = [0, 0, w]
  const p3: Position3D = [-w, 0, 0]
  const p4: Position3D = [0, 0, -w]

  const top: Position3D = [0, -h, 0]
  const bottom: Position3D = [0, h, 0]

  const face1: GeometrySpec = {
    coords: [p1, p2, top],
    normalPosition: [w, -h, w],
  }
  const face2: GeometrySpec = {
    coords: [p2, p3, top],
    normalPosition: [-w, -h, w],
  }
  const face3: GeometrySpec = {
    coords: [p3, p4, top],
    normalPosition: [-w, -h, -w],
  }
  const face4: GeometrySpec = {
    coords: [p4, p1, top],
    normalPosition: [w, -h, -w],
  }

  const face5: GeometrySpec = {
    coords: [p1, p2, bottom],
    normalPosition: [w, h, w],
  }
  const face6: GeometrySpec = {
    coords: [p2, p3, bottom],
    normalPosition: [-w, h, w],
  }
  const face7: GeometrySpec = {
    coords: [p3, p4, bottom],
    normalPosition: [-w, h, -w],
  }
  const face8: GeometrySpec = {
    coords: [p4, p1, bottom],
    normalPosition: [w, h, -w],
  }

  return finalizeGeometries([face1, face2, face3, face4, face5, face6, face7, face8])
}

export const makeOctaEmitter = (level: number): StaticModelEmitter => {
  const size = (FloorPathAvgLength / 2) * level
  const geometries = createOcta(size, size)
  const placement = (block: RenderBlockCoords) =>
    averagePosition3ds([block.front.bl, block.front.br, block.rear.bl, block.rear.br])
  return (blockcoords) => {
    const groundPosition = placement(blockcoords)
    return geometries.map((geometry) => ({
      geometry,
      position: [groundPosition[0], groundPosition[1] - size, groundPosition[2]],
    }))
  }
}
