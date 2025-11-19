import { GeometryPreviewer } from './preview'
import { runPipeline } from '../pipeline/pipeline'
import { computeVertexNormals, recomputeFaceNormals } from '../pipeline/processors/normals'
import { generateTileGeometry } from '../models/generators/tile'
import { tesselateGeometry } from '../pipeline/processors/tessellation'
import { deformGeometry } from '../pipeline/processors/deformation'
import { triangulateFaces } from '../pipeline/processors/triangulation'
import { generatePoleGeometry } from '../models/generators/pole'

// const base = geometries.boxSpec

const tile = generateTileGeometry({
  numOfCorners: 17,
  radiusBase: 0.8,
  radiusDelta: 0.7,
  thicknessBase: 1.5,
  thicknessDelta: 1.0,
})

const pole = generatePoleGeometry({
  type: 'pole',
  radiusBase: 1,
  radiusDelta: 0.8,
  numOfCorners: 3,
  heightBase: 8,
  heightDelta: 4,
  heightPerSegment: 2,
  segmentYDelta: 0.3
})


const geo = runPipeline(pole, [
  recomputeFaceNormals,
  computeVertexNormals
])

console.log(pole)
console.log(geo)

new GeometryPreviewer(geo)
