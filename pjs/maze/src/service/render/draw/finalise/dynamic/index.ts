import { DynamicModel } from '../../model'
import { Scaffold, getRenderBlock } from '../../scaffold'
import { DrawableObject } from '../types'
import { finalizeGeometries } from './finalize'
import { ConvertModelMap } from './models'
import { GeometrySpec } from './types'

export const convertDynamicModelsToDrawables = (
  model: DynamicModel,
  scaffold: Scaffold
): DrawableObject[] => {
  const specs = convertToGeometrySpecList(model, scaffold)
  return finalizeGeometries(specs).map((geo) => ({
    geometry: geo,
    position: [0, 0, 0],
  }))
}

export const convertToGeometrySpecList = (
  model: DynamicModel,
  scaffold: Scaffold
): GeometrySpec[] => {
  const block = getRenderBlock(scaffold, model.position)
  return ConvertModelMap[model.code]({
    blockCoords: block,
    position: model.position,
  })
}
