import { GeometryGenerator } from './types'
import { tileGeometryFactory } from '../factory/tile'
import { runPipeline } from '../../pipeline/pipeline'
import { computeNormals, recomputeFaceNormals } from '../../pipeline/processors/normals'
import { deformGeometry, randomiseVertex } from '../../pipeline/processors/deformation'
import { ModelSize } from '../entity'
import { randomFloatBetween, randomIntInclusiveBetween } from 'utils'

const SizeRangeMap: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [1, 1],
  [ModelSize.Large]: [0.7, 0.8],
  [ModelSize.Medium]: [0.6, 0.7],
  [ModelSize.Small]: [0.5, 0.6],
}

const CornersRange: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [16, 16],
  [ModelSize.Large]: [12, 16],
  [ModelSize.Medium]: [8, 12],
  [ModelSize.Small]: [4, 8],
}

const ThicknessRange: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [1, 1],
  [ModelSize.Large]: [0.8, 1],
  [ModelSize.Medium]: [0.6, 0.8],
  [ModelSize.Small]: [0.4, 0.6],
}

export const generateTile: GeometryGenerator = (size, variant) => {
  const radiusBase = randomFloatBetween(...SizeRangeMap[size])
  const radiusDelta = Math.max(0.1, radiusBase * 2.0 - 0.4)
  const numOfCorners = randomIntInclusiveBetween(...CornersRange[size])
  const thicknessBase = randomFloatBetween(...ThicknessRange[size])
  const thicknessDelta = thicknessBase * randomFloatBetween(0.1, 0.3)

  const distortion = 0.1

  const tile = tileGeometryFactory({
    radiusBase,
    radiusDelta,
    numOfCorners,
    thicknessBase,
    thicknessDelta,
  })

  return runPipeline(tile, [
    recomputeFaceNormals,
    deformGeometry(randomiseVertex(distortion)),
    computeNormals('preserve'),
  ])
}
