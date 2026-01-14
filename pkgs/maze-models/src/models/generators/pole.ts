import { GeometryGenerator } from './types'
import { poleGeometryFactory, PoleGeometryParams } from '../factory/pole'
import { runPipeline } from '../../pipeline/pipeline'
import { computeNormals, recomputeFaceNormals } from '../../pipeline/processors/normals'
import { deformGeometry, randomiseVertex } from '../../pipeline/processors/deformation'
import { ModelSize } from '../entity'
import { randomFloatBetween, randomFloatInAsymmetricRange, randomIntInclusiveBetween } from 'utils'

const SizeRangeMap: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [1, 1],
  [ModelSize.Large]: [0.85, 0.96],
  [ModelSize.Medium]: [0.75, 0.88],
  [ModelSize.Small]: [0.7, 0.8],
}

const CornersRange: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [8, 8],
  [ModelSize.Large]: [7, 12],
  [ModelSize.Medium]: [6, 10],
  [ModelSize.Small]: [5, 8],
}

export const generatePole = (length: number): GeometryGenerator => (size, variant) => {

  const distortion = 0.1
  const sizeRange = SizeRangeMap[size]
  const radiusBase = randomFloatBetween(...sizeRange)
  const radiusDelta = Math.max(0.1, radiusBase * 3 * variant * 0.1)
  const numOfCorners = randomIntInclusiveBetween(...CornersRange[size])

  const poleParams: PoleGeometryParams = {
    type: 'pole',
    radiusBase,
    radiusDelta,
    numOfCorners,
    heightBase: length * 2,
    heightDelta: 0,
    heightPerSegment: 1.0 + randomFloatInAsymmetricRange(variant * 0.1),
    segmentYDelta: 0.8,
  }

  const pole = poleGeometryFactory(poleParams)
  return runPipeline(pole, [
    recomputeFaceNormals,
    deformGeometry(randomiseVertex(distortion, false)),
    computeNormals('face'),
  ])
}
