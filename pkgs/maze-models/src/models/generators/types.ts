import { NormalComputeType } from '../../pipeline/processors/normals'
import { GeometrySpec } from '../../pipeline/types'
import { ModelSize } from '../entity'

export type GeometryGenerator = (size: ModelSize, variant: number) => GeometrySpec

export type BaseParams = {
  tesselation?: number
  normalComputeType?: NormalComputeType
}
