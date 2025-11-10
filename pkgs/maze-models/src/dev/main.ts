import * as geometries from './geometries'
import { GeometryPreviewer } from './preview'
import { runPipeline } from '../pipeline/pipeline'
import { tesselateGeometry } from '../pipeline/processors/tessellation'
import { triangulateFaces } from '../pipeline/processors/triangulation'
import { recomputeNormals } from '../pipeline/processors/normals'

const base = geometries.boxSpec

const final = runPipeline(base, [
  tesselateGeometry(4),
  triangulateFaces,
  recomputeNormals,
])

console.log(final)

new GeometryPreviewer(final)
