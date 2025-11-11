import { ModelCode } from './code'
import { GeometrySpec } from '../pipeline/types'
import { BaseGeometryMap } from './base'
import { runPipeline } from '../pipeline/pipeline'
import { tesselateGeometry } from '../pipeline/processors/tessellation'
import { triangulateFaces } from '../pipeline/processors/triangulation'
import { deformGeometry } from '../pipeline/processors/deformation'
import { recomputeNormals } from '../pipeline/processors/normals'

export type { ModelCode } from './code'

export const generateGeometry = (modelCode: ModelCode): GeometrySpec => {
  const base = BaseGeometryMap[modelCode]

  return runPipeline(base, [
    tesselateGeometry(10),
    triangulateFaces,
    deformGeometry((v) => [
      v[0] + (Math.random() - 0.5) * 0.2,
      v[1] + (Math.random() - 0.5) * 0.2,
      v[2] + (Math.random() - 0.5) * 0.2,
    ]),
    recomputeNormals,
  ])
}
