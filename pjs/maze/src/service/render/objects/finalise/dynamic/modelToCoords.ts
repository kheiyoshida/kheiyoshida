import { CompoundModelCode, DynamicModelCode, ModelCodeGrid } from '../../model'
import { RenderBlockPosition, Scaffold, getRenderBlock } from '../../scaffold'
import { ConvertModelMap } from './models'
import { GeometrySpec } from './types'

export const convertToGeometrySpecList = (
  modelGrid: ModelCodeGrid,
  scaffold: Scaffold
): GeometrySpec[] => {
  return modelGrid.flatMap((modelLayer, z) =>
    modelLayer.flatMap((compound, x) => convert(scaffold, compound, { x, z }))
  )
}

const convert = (
  scaffold: Scaffold,
  compound: CompoundModelCode,
  blockPosition: RenderBlockPosition
): GeometrySpec[] => {
  const block = getRenderBlock(scaffold, blockPosition)
  return compound.flatMap((model) =>
    ConvertModelMap[model as DynamicModelCode]({ blockCoords: block, position: blockPosition })
  )
}
