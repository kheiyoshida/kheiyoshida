import { GeometryPreviewer } from './preview'
import { runPipeline } from '../pipeline/pipeline'
import { computeVertexNormals, recomputeFaceNormals } from '../pipeline/processors/normals'
import { generateTileGeometry } from '../models/generators/tile'
import { tesselateGeometry } from '../pipeline/processors/tessellation'
import { deformGeometry } from '../pipeline/processors/deformation'
import { triangulateFaces } from '../pipeline/processors/triangulation'

// const base = geometries.boxSpec

const tile = generateTileGeometry({
  numOfCorners: 17,
  radiusBase: 0.8,
  radiusDelta: 0.7,
  thicknessBase: 1.5,
  thicknessDelta: 1.0,
})


const tileGeo = JSON.parse(JSON.stringify(tile))
const geo = runPipeline(tileGeo, [
  recomputeFaceNormals,
  computeVertexNormals
])

console.log(tile)
console.log(geo)

new GeometryPreviewer(geo)
