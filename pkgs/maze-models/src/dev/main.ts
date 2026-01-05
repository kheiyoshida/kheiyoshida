import { GeometryPreviewer } from './preview'
import { generatePole } from '../models/generators/pole'

const geo = generatePole('Pole3', {
  type: 'pole',
  radiusBase: 1,
  radiusDelta: 0.8,
  numOfCorners: 8,
  heightBase: 4,
  heightDelta: 0,
  heightPerSegment: 0.5,
  segmentYDelta: 1.2,
  normalComputeType: 'preserve',
  distortion: 0,
})

new GeometryPreviewer(geo)
