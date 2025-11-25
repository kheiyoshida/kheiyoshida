import { BaseParams, ModelGenerator } from './types'
import { TileModelCode } from '../code'
import { tileGeometryFactory, TileParams } from '../factory/tile'
import { runPipeline } from '../../pipeline/pipeline'
import { computeNormals, recomputeFaceNormals } from '../../pipeline/processors/normals'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { deformGeometry, randomiseVertex } from '../../pipeline/processors/deformation'

export type TileModelParams = BaseParams & TileParams & {
  distortion: number
}

export const generateTile: ModelGenerator<TileModelCode, TileModelParams> = (code, params) => {
  const tile = tileGeometryFactory(params)
  return runPipeline(tile, [
    recomputeFaceNormals,
    tesselateGeometry(params.tesselation),
    deformGeometry(randomiseVertex(params.distortion)),
    computeNormals(params.normalComputeType),
  ])
}
