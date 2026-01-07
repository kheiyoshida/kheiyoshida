import { BaseParams, GeometryGenerator } from './types'
import { poleGeometryFactory, PoleGeometryParams } from '../factory/pole'
import { runPipeline } from '../../pipeline/pipeline'
import { computeNormals, recomputeFaceNormals } from '../../pipeline/processors/normals'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { deformGeometry, randomiseVertexWithPreserveY } from '../../pipeline/processors/deformation'

export type PoleModelParams = BaseParams & PoleGeometryParams & {
  distortion: number
}

export const generatePole = (length: number): GeometryGenerator => (size, variant) => {

  const params: PoleModelParams = {
    type: 'pole',
    radiusBase: 0.6, // todo: apply size
    radiusDelta: 0.8,
    numOfCorners: 8,
    heightBase: length * 2, // will be overridden
    heightDelta: 0,
    heightPerSegment: 0.5,
    segmentYDelta: 0.3,
    normalComputeType: 'preserve',
    distortion: 0,
  }

  const pole = poleGeometryFactory(params)
  return runPipeline(pole, [
    recomputeFaceNormals,
    tesselateGeometry(params.tesselation),
    deformGeometry(randomiseVertexWithPreserveY(params.distortion, 0)),
    computeNormals(params.normalComputeType),
  ])
}
