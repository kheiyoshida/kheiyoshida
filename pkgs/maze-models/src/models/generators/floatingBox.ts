import { GeometryGenerator } from './types'
import { getBaseGeometry } from '../factory'
import { conditional, runPipeline } from '../../pipeline/pipeline'
import {
  deformGeometry,
  randomiseVertex,
  skipCorners,
  skipTopFace,
} from '../../pipeline/processors/deformation'
import { randomFloatBetween } from 'utils'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { triangulateFaces } from '../../pipeline/processors/triangulation'
import { computeNormals } from '../../pipeline/processors/normals'
import { ModelSize } from '../entity'

const FloatingBoxSizeRange: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [1, 1],
  [ModelSize.Large]: [0.7, 1.0],
  [ModelSize.Medium]: [0.5, 0.8],
  [ModelSize.Small]: [0.3, 0.6],
}

const FloatingBoxTesselation: Record<ModelSize, number> = {
  [ModelSize.Expand]: 3,
  [ModelSize.Large]: 3,
  [ModelSize.Medium]: 2,
  [ModelSize.Small]: 1,
}

export const generateFloatingBox =
  (isFloor: boolean): GeometryGenerator =>
  (size, variant) => {
    const sizeRange = FloatingBoxSizeRange[size]
    const tesselation = FloatingBoxTesselation[size]
    const distortion = 0.1

    const expand = size === ModelSize.Expand

    const baseBox = getBaseGeometry('Box')
    return runPipeline(baseBox, [
      conditional(
        !expand,
        deformGeometry((v) => {
          const scale = randomFloatBetween(...sizeRange)
          return [v[0] * scale, v[1] * (isFloor ? 1 : scale), v[2] * scale]
        })
      ),
      tesselateGeometry(tesselation),
      triangulateFaces,
      deformGeometry(
        expand ? skipCorners(randomiseVertex(distortion)) : skipTopFace(randomiseVertex(distortion))
      ),
      computeNormals('preserve'),
    ])
  }
