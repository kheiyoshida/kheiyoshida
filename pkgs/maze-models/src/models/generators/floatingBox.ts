import { GeometryGenerator } from './types'
import { getBaseGeometry } from '../factory'
import { runPipeline } from '../../pipeline/pipeline'
import { deformGeometry, randomiseVertex } from '../../pipeline/processors/deformation'
import { randomFloatBetween } from 'utils'
import { computeNormals } from '../../pipeline/processors/normals'
import { ModelSize } from '../entity'

const FloatingBoxSizeRange: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [1, 1.1],
  [ModelSize.Large]: [0.7, 1.0],
  [ModelSize.Medium]: [0.5, 0.8],
  [ModelSize.Small]: [0.3, 0.6],
}

export const generateFloatingBox =
  (isFloor: boolean): GeometryGenerator =>
  (size, variant) => {
    const sizeRange = FloatingBoxSizeRange[size]
    const distortion = variant * 0.1

    const baseBox = getBaseGeometry('Box')
    return runPipeline(baseBox, [
      deformGeometry((v) => {
        const scale = randomFloatBetween(...sizeRange)
        return [v[0] * scale, v[1] * (isFloor ? 1 : scale), v[2] * scale]
      }),
      deformGeometry(randomiseVertex(distortion)),
      computeNormals('face'),
    ])
  }
