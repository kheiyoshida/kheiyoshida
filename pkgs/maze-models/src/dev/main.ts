import * as geometries from './geometries'
import { GeometryPreviewer } from './preview'
import { runPipeline } from '../pipeline/pipeline'
import { tesselateGeometry } from '../pipeline/processors/tessellation'
import { triangulateFaces } from '../pipeline/processors/triangulation'
import { recomputeNormals } from '../pipeline/processors/normals'
import { deformGeometry } from '../pipeline/processors/deformation'

const base = geometries.boxSpec

const final = runPipeline(base, [
  tesselateGeometry(4),
  triangulateFaces,
  deformGeometry((v) => [
    v[0] + (Math.random() - 0.5) * 0.1,
    v[1] + (Math.random() - 0.5) * 0.1,
    v[2] + (Math.random() - 0.5) * 0.1,
  ]),
  recomputeNormals,
])

console.log(final)

new GeometryPreviewer(final)
