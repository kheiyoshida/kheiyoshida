import { GeometryGenerator } from './types'
import { tileGeometryFactory } from '../factory/tile'
import { runPipeline } from '../../pipeline/pipeline'
import { computeNormals, recomputeFaceNormals } from '../../pipeline/processors/normals'
import { deformGeometry, randomiseVertex, skipTopFace } from '../../pipeline/processors/deformation'
import { ModelSize } from '../entity'
import { randomFloatBetween, randomIntInclusiveBetween } from 'utils'

const SizeRangeMap: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [1, 1],
  [ModelSize.Large]: [0.9, 1.0],
  [ModelSize.Medium]: [0.8, 0.9],
  [ModelSize.Small]: [0.7, 0.8],
}

const CornersRange: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [16, 16],
  [ModelSize.Large]: [8, 10],
  [ModelSize.Medium]: [6, 9],
  [ModelSize.Small]: [4, 6],
}

const ThicknessRange: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [1, 1],
  [ModelSize.Large]: [0.8, 1],
  [ModelSize.Medium]: [0.6, 0.8],
  [ModelSize.Small]: [0.4, 0.6],
}

export const generateTile = (isFloor: boolean): GeometryGenerator => (size, variant) => {
  const radiusBase = randomFloatBetween(...SizeRangeMap[size])
  const radiusDelta = Math.max(0.1, variant * 0.1 )
  const numOfCorners = randomIntInclusiveBetween(...CornersRange[size])
  const thicknessBase = randomFloatBetween(...ThicknessRange[size])
  const thicknessDelta = thicknessBase * randomFloatBetween(0.1, 0.3)
  const distortion = variant * 0.1

  const tile = tileGeometryFactory({
    radiusBase,
    radiusDelta,
    numOfCorners,
    thicknessBase,
    thicknessDelta,
  })

  return runPipeline(tile, [
    recomputeFaceNormals,
    deformGeometry(isFloor ? skipTopFace(randomiseVertex(distortion)) : randomiseVertex(distortion)),
    computeNormals('face'),
  ])
}
