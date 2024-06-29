import { DynamicModelCode, RenderModel } from '../../model'
import { Scaffold, getRenderBlock } from '../../scaffold'
import { ConvertModelMap } from './models'
import { GeometrySpec } from './types'

export const convertToGeometrySpecList = (
  models: RenderModel[],
  scaffold: Scaffold
): GeometrySpec[] =>
  models.flatMap((model) => {
    const block = getRenderBlock(scaffold, model.position)
    return ConvertModelMap[model.code as DynamicModelCode]({
      blockCoords: block,
      position: model.position,
    })
  })
