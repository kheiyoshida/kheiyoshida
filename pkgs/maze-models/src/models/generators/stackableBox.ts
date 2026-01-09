import { runPipeline } from '../../pipeline/pipeline'
import { deformGeometry, randomiseVertex } from '../../pipeline/processors/deformation'
import { computeNormals } from '../../pipeline/processors/normals'
import { getBaseGeometry } from '../factory'
import { GeometryGenerator } from './types'
import { ModelSize } from '../entity'
import { randomFloatBetween } from 'utils'

const StackableBoxSizeRange: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [1, 1.1],
  [ModelSize.Large]: [0.7, 1.0],
  [ModelSize.Medium]: [0.5, 0.8],
  [ModelSize.Small]: [0.3, 0.6],
}

export const generateStackableBox =
  ({ stair }: { stair: boolean }): GeometryGenerator =>
  (size, variant) => {
    const sizeRange = StackableBoxSizeRange[size]
    const distortion = variant * 0.1

    const base = stair ? getBaseGeometry('StairBox') : getBaseGeometry('Box')

    return runPipeline(base, [
      deformGeometry((v) => {
        const scale = randomFloatBetween(...sizeRange)
        return [v[0] * scale, v[1], v[2] * scale]
      }),
      deformGeometry(randomiseVertex(distortion)),
      computeNormals('face'),
    ])
  }
