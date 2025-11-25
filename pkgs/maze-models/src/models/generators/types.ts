import { ModelCode } from '../code'
import { GeometrySpec } from '../../pipeline/types'
import { NormalComputeType } from '../../pipeline/processors/normals'

export type ModelGenerator<C extends ModelCode, P extends BaseParams = BaseParams> = (modelCode: C, params: P) => GeometrySpec

export type BaseParams = {
  tesselation?: number
  normalComputeType?: NormalComputeType
}
