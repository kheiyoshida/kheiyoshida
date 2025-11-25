import { BaseParams, ModelGenerator } from './types'
import { poleGeometryFactory, PoleGeometryParams } from '../factory/pole'
import { PoleModelCode } from '../code'
import { runPipeline } from '../../pipeline/pipeline'
import { computeNormals, recomputeFaceNormals } from '../../pipeline/processors/normals'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { deformGeometry, randomiseVertex } from '../../pipeline/processors/deformation'

export type PoleModelParams = BaseParams & PoleGeometryParams & {
  distortion: number
}

export const generatePole: ModelGenerator<PoleModelCode, PoleModelParams> = (code, params) => {
  const pole = poleGeometryFactory(params)
  return runPipeline(pole, [
    recomputeFaceNormals,
    tesselateGeometry(params.tesselation),
    deformGeometry(randomiseVertex(params.distortion)),
    computeNormals(params.normalComputeType),
  ])
}
