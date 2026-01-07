import { randomFloatBetween } from 'utils'
import { runPipeline } from '../../pipeline/pipeline'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { triangulateFaces } from '../../pipeline/processors/triangulation'
import { deformGeometry, randomiseVertex } from '../../pipeline/processors/deformation'
import { computeNormals } from '../../pipeline/processors/normals'
import { getBaseGeometry } from '../factory'
import { BaseParams, GeometryGenerator } from './types'

export type FloatingBoxParams = BaseParams & {
  sizeRange: [number, number]
  distortion: number
}

export const generateFloatingBox: GeometryGenerator = (size, variant) => {
  const params: FloatingBoxParams = {
    tesselation: 3,
    sizeRange: [0.8, 0.9], // todo: adjust based on size
    normalComputeType: undefined,
    distortion: 0.1,
  }

  const baseBox = getBaseGeometry('Box')
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

export const generateStackableBox =
  ({ stair }: { stair: boolean }): GeometryGenerator =>
  (size, variant) => {
    const params: StackableBoxParams = {
      tesselation: 3,
      sizeRange: [0.5, 1.0], // TODO: apply size
      normalComputeType: undefined,
      distortion: 0.1,
    }

    const base = stair ? getBaseGeometry('StairBox') : getBaseGeometry('Box')
    return runPipeline(base, [
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
