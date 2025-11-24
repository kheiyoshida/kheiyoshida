import { GeometrySpec } from '../../pipeline/types'
import { ModifierParams } from '../modifiers'
import { randomFloatBetween } from 'utils'
import { runPipeline } from '../../pipeline/pipeline'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { triangulateFaces } from '../../pipeline/processors/triangulation'
import { deformGeometry } from '../../pipeline/processors/deformation'
import { computeVertexNormals, recomputeFaceNormals } from '../../pipeline/processors/normals'

export type FloatingBoxParams = Omit<ModifierParams, 'deform'> & {
  sizeRange: [number, number]
  distortion: number
}

export const generateFloatingBox = (baseBox: GeometrySpec, params: FloatingBoxParams): GeometrySpec => {
  return runPipeline(baseBox, [
    deformGeometry((v) => {
      const scaling = randomFloatBetween(...params.sizeRange)
      const [x, y, z] = v
      return [x * scaling, y * scaling, z * scaling]
    }),
    tesselateGeometry(params.tesselation),
    triangulateFaces,
    deformGeometry((v) => {
      return [
        v[0] + (Math.random() - 0.5) * params.distortion,
        v[1] + (Math.random() - 0.5) * params.distortion,
        v[2] + (Math.random() - 0.5) * params.distortion,
      ]
    }),
    params.computeNormals == 'face' || params.computeNormals == 'vertex' ? recomputeFaceNormals : (g) => g,
    params.computeNormals == 'vertex' ? computeVertexNormals : (g) => g,
  ])
}

export type StackableBoxParams = Omit<ModifierParams, 'deform'> & {
  sizeRange: [number, number]
  distortion: number
}

export const generateStackableBox = (baseBox: GeometrySpec, params: StackableBoxParams) => {
  return runPipeline(baseBox, [
    deformGeometry((v) => [
      v[0] * randomFloatBetween(...params.sizeRange),
      v[1],
      v[2] * randomFloatBetween(...params.sizeRange),
    ]),
    tesselateGeometry(params.tesselation),
    triangulateFaces,
    deformGeometry((v) => {
      return [
        v[0] + (Math.random() - 0.5) * params.distortion,
        v[1] + (Math.random() - 0.5) * params.distortion * 0.5,
        v[2] + (Math.random() - 0.5) * params.distortion,
      ]
    }),
    params.computeNormals == 'face' || params.computeNormals == 'vertex' ? recomputeFaceNormals : (g) => g,
    params.computeNormals == 'vertex' ? computeVertexNormals : (g) => g,
  ])
}
