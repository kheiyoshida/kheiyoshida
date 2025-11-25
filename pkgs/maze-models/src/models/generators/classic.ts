import { ClassicModelCode } from '../code'
import { GeometrySpec, Vector3D } from '../../pipeline/types'
import { getBaseGeometry } from '../factory'
import { runPipeline } from '../../pipeline/pipeline'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { triangulateFaces } from '../../pipeline/processors/triangulation'
import { deformGeometry } from '../../pipeline/processors/deformation'
import { computeNormals } from '../../pipeline/processors/normals'
import { BaseParams, ModelGenerator } from './types'

export type ClassicModelParams = BaseParams

export const generateClassicModel: ModelGenerator<ClassicModelCode> = (
  code: ClassicModelCode,
  params: ClassicModelParams
): GeometrySpec => {
  const base = getBaseGeometry(code)
  return runPipeline(base, [
    tesselateGeometry(params.tesselation),
    triangulateFaces,
    deformGeometry(classicDeform),
    computeNormals(params.normalComputeType),
  ])
}

const isBoxCorner = (v: Vector3D): boolean => v.map(Math.abs).every((val) => val === 1)
const classicDeform = (v: Vector3D): Vector3D => {
  if (isBoxCorner(v)) return v
  return [
    v[0] + (Math.random() - 0.5) * 0.3,
    v[1] + (Math.random() - 0.5) * 0.3,
    v[2] + (Math.random() - 0.5) * 0.3,
  ]
}
