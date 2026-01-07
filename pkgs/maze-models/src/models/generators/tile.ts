import { BaseParams, GeometryGenerator } from './types'
import { tileGeometryFactory, TileParams } from '../factory/tile'
import { runPipeline } from '../../pipeline/pipeline'
import { computeNormals, recomputeFaceNormals } from '../../pipeline/processors/normals'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { deformGeometry, randomiseVertex } from '../../pipeline/processors/deformation'

export type TileModelParams = BaseParams & TileParams & {
  distortion: number
}

export const generateTile: GeometryGenerator = (size, variant) => {
  const params: TileModelParams = {
    numOfCorners: 20,
    radiusBase: 0.8,
    radiusDelta: 0.7,
    thicknessBase: 1.5,
    thicknessDelta: 1.0,
    distortion: 0,
    tesselation: 0,
    normalComputeType: 'preserve',
  }
  const tile = tileGeometryFactory(params)
  return runPipeline(tile, [
    recomputeFaceNormals,
    tesselateGeometry(params.tesselation),
    deformGeometry(randomiseVertex(params.distortion)),
    computeNormals(params.normalComputeType),
  ])
}
