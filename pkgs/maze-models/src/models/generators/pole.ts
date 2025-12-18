import { BaseParams, ModelGenerator } from './types'
import { poleGeometryFactory, PoleGeometryParams } from '../factory/pole'
import { PoleModelCode } from '../code'
import { runPipeline } from '../../pipeline/pipeline'
import { computeNormals, recomputeFaceNormals } from '../../pipeline/processors/normals'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { deformGeometry, randomiseVertexWithPreserveY } from '../../pipeline/processors/deformation'

export type PoleModelParams = BaseParams & PoleGeometryParams & {
  distortion: number
}

export const generatePole: ModelGenerator<PoleModelCode, PoleModelParams> = (code, params) => {
  const length = Number(code[code.length - 1])
  if (isNaN(length)) throw new Error(`Invalid pole length: ${code}`)
  const pole = poleGeometryFactory({ ...params, heightBase: length * 2 })
  return runPipeline(pole, [
    recomputeFaceNormals,
    tesselateGeometry(params.tesselation),
    deformGeometry(randomiseVertexWithPreserveY(params.distortion, 0)),
    computeNormals(params.normalComputeType),
  ])
}
