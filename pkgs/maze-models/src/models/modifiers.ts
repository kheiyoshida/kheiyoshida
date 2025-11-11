import { Vector3D } from 'maze-gl'
import { GeometrySpec } from '../pipeline/types'
import { runPipeline } from '../pipeline/pipeline'
import { tesselateGeometry } from '../pipeline/processors/tessellation'
import { triangulateFaces } from '../pipeline/processors/triangulation'
import { deformGeometry } from '../pipeline/processors/deformation'
import { recomputeNormals } from '../pipeline/processors/normals'

export type ModifierParams = {
  tesselation: number
  deform: (v: Vector3D) => Vector3D
}

export const defaultModifier = ({ tesselation, deform }: ModifierParams) => (base: GeometrySpec): GeometrySpec => {
  return runPipeline(base, [
    tesselateGeometry(tesselation),
    triangulateFaces,
    deformGeometry(deform),
    recomputeNormals,
  ])
}
