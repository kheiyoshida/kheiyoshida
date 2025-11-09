import { boxSpec } from './box'
import { GeometryPreviewer } from './preview'
import { runPipeline } from '../pipeline/pipeline'
import { tesselateGeometry } from '../pipeline/processors/tessellation'
import { triangulateFaces } from '../pipeline/processors/triangulation'
import { mergeGeometry } from '../pipeline/processors/merge'
import { weldVertices } from '../pipeline/processors/welding'
import { recomputeNormals } from '../pipeline/processors/normals'

const base = boxSpec

const final = runPipeline(base, [
  tesselateGeometry,
  triangulateFaces,
  mergeGeometry,
  weldVertices,
  // recomputeNormals,
])

console.log(base.normals)
console.log(final.normals)

new GeometryPreviewer(final)
