import { conditional, runPipeline } from '../../pipeline/pipeline'
import { tesselateGeometry } from '../../pipeline/processors/tessellation'
import { triangulateFaces } from '../../pipeline/processors/triangulation'
import {
  deformGeometry,
  randomiseVertex,
  randomiseWithinRange,
  skipCorners,
} from '../../pipeline/processors/deformation'
import { computeNormals } from '../../pipeline/processors/normals'
import { getBaseGeometry } from '../factory'
import { GeometryGenerator } from './types'
import { ModelSize } from '../entity'

const StackableBoxSizeRange: Record<ModelSize, [number, number]> = {
  [ModelSize.Expand]: [1, 1],
  [ModelSize.Large]: [0.7, 1.0],
  [ModelSize.Medium]: [0.5, 0.8],
  [ModelSize.Small]: [0.3, 0.6],
}

const StackableBoxTesselation: Record<ModelSize, number> = {
  [ModelSize.Expand]: 3,
  [ModelSize.Large]: 3,
  [ModelSize.Medium]: 2,
  [ModelSize.Small]: 1,
}

export const generateStackableBox =
  ({ stair }: { stair: boolean }): GeometryGenerator =>
  (size, variant) => {
    const sizeRange = StackableBoxSizeRange[size]
    const expand = size === ModelSize.Expand
    const distortion = 0.5 // TODO: determine distortion based on variant?

    const tesselation = StackableBoxTesselation[size]

    const base = stair ? getBaseGeometry('StairBox') : getBaseGeometry('Box')

    return runPipeline(base, [
      conditional(!expand, randomiseWithinRange(sizeRange[0], sizeRange[1], true)),
      tesselateGeometry(tesselation),
      triangulateFaces,
      deformGeometry(skipCorners(randomiseVertex(distortion, true))),
      computeNormals('preserve'),
    ])
  }
