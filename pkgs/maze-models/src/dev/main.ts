import * as geometries from './geometries'
import { GeometryPreviewer } from './preview'
import { runPipeline } from '../pipeline/pipeline'
import { tesselateGeometry } from '../pipeline/processors/tessellation'
import { triangulateFaces } from '../pipeline/processors/triangulation'
import { mergeGeometry } from '../pipeline/processors/merge'
import { weldVertices } from '../pipeline/processors/welding'

const base = geometries.rectangle

const final = runPipeline(base, [
  tesselateGeometry(4),
  triangulateFaces,
  // mergeGeometry,
  // weldVertices,
  // recomputeNormals,
])

console.log(final)

new GeometryPreviewer(final)
