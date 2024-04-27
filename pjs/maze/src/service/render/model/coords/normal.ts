import { Position3D } from 'p5utils/src/3d'
import { RenderPosition } from '../../../../domain/translate/renderGrid/renderSpec'
import { RenderBlockCoords, RenderBlockPosition, RenderModel } from '../types'
import { getBlockCenter } from './block'

export const getNormalPosition = (
  model: RenderModel,
  position: RenderBlockPosition,
  getRenderBlock: (p: RenderBlockPosition) => RenderBlockCoords
): Position3D => {
  const normalBlockPosition = getNormalPositionBlock(model, position)
  return getBlockCenter(getRenderBlock(normalBlockPosition))
}

const getNormalPositionBlock = (
  model: RenderModel,
  position: RenderBlockPosition
): RenderBlockPosition => {
  switch (model) {
    case RenderModel.FrontWall:
      if (position.z === 0) return position
      return {
        x: position.x,
        z: position.z - 1,
      }
    case RenderModel.SideWall:
      return {
        x: RenderPosition.CENTER,
        z: position.z,
      }
    case RenderModel.StairCeil:
      return {
        x: RenderPosition.CENTER,
        z: position.z,
        y: -1
      }
    default:
      return position
  }
}
