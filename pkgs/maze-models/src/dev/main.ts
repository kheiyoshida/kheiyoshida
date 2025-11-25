import { GeometryPreviewer } from './preview'
import { generateFloatingBox, generateStackableBox } from '../models/generators/box'
import { boxSpec } from './geometries'
import { stairBoxSpec } from '../models/factory/primitives/box'

// const geo = generateFloatingBox(boxSpec, {
//   tesselation: 3,
//   sizeRange: [0.8, 0.9],
//   computeNormals: 'vertex',
//   distortion: 0.1,
// })

const geo = generateStackableBox(stairBoxSpec, {
  tesselation: 3,
  sizeRange: [0.8, 1.0],
  normalComputeType: 'vertex',
  distortion: 0.1,
})

new GeometryPreviewer(geo)
