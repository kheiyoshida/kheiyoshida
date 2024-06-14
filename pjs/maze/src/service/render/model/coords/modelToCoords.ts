import { Scaffold } from '../../scaffold'
import { CompoundRenderModel, GeometrySpec, ModelGrid, RenderBlockPosition } from '../types'
import { getRenderBlock } from './block'
import { ConvertModelMap } from './models'

export const convertToGeometrySpecList = (
  modelGrid: ModelGrid,
  scaffold: Scaffold
): GeometrySpec[] => {
  return modelGrid.flatMap((modelLayer, z) =>
    modelLayer.flatMap((compound, x) => convert(scaffold, compound, { x, z }))
  )
}

const convert = (
  scaffold: Scaffold,
  compound: CompoundRenderModel,
  blockPosition: RenderBlockPosition
): GeometrySpec[] => {
  const block = getRenderBlock(scaffold, blockPosition)
  return compound.flatMap((model) =>
    ConvertModelMap[model]({ blockCoords: block, position: blockPosition })
  )
}
