import { randomFloatBetween } from 'utils'
import { runPipeline } from '../../pipeline/pipeline'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { triangulateFaces } from '../../pipeline/processors/triangulation'
import { deformGeometry, randomiseVertex } from '../../pipeline/processors/deformation'
import { computeNormals } from '../../pipeline/processors/normals'
import { getBaseGeometry } from '../factory'
import { BaseParams, ModelGenerator } from './types'
import { FloatingBoxModelCode, StackableBoxModelCode } from '../code'

export type FloatingBoxParams = BaseParams & {
  sizeRange: [number, number]
  distortion: number
}

export const generateFloatingBox: ModelGenerator<FloatingBoxModelCode, FloatingBoxParams> = (
  modelCode,
  params
) => {
  const baseBox = getBaseGeometry(modelCode)
  return runPipeline(baseBox, [
    deformGeometry((v) => {
      const scaling = randomFloatBetween(...params.sizeRange)
      const [x, y, z] = v
      return [x * scaling, y * scaling, z * scaling]
    }),
    tesselateGeometry(params.tesselation),
    triangulateFaces,
    deformGeometry(randomiseVertex(params.distortion)),
    computeNormals(params.normalComputeType),
  ])
}

export type StackableBoxParams = Omit<BaseParams, 'deform'> & {
  sizeRange: [number, number]
  distortion: number
}

export const generateStackableBox: ModelGenerator<StackableBoxModelCode, StackableBoxParams> = (modelCode, params) => {
  return runPipeline(getBaseGeometry(modelCode), [
    deformGeometry((v) => [
      v[0] * randomFloatBetween(...params.sizeRange),
      v[1],
      v[2] * randomFloatBetween(...params.sizeRange),
    ]),
    tesselateGeometry(params.tesselation),
    triangulateFaces,
    deformGeometry((v) => [
      v[0] + (Math.random() - 0.5) * params.distortion,
      v[1],
      v[2] + (Math.random() - 0.5) * params.distortion,
    ]),
    computeNormals(params.normalComputeType),
  ])
}
