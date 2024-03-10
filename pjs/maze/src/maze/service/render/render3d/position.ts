import { Position3D } from 'p5utils/src/3d/types'
import {
  RenderGrid,
  RenderLayerIndex,
  RenderPattern,
  RenderPosition,
} from '../../../domain/compose/renderSpec'

export const convertRenderGridIntoCoordinates = (renderGrid: RenderGrid): [Position3D[] , Position3D | undefined]=> {
  const coordinates: Position3D[] = []
  let stair: Position3D | undefined
  renderGrid.forEach((layer, layerIndex) => {
    if (!layer) return
    layer.forEach((pattern, position) => {
      if (pattern === RenderPattern.FILL) {
        coordinates.push(indexToCoordinates(layerIndex as RenderLayerIndex, position))
      }
      if (pattern === RenderPattern.STAIR) {
        stair = indexToCoordinates(layerIndex as RenderLayerIndex, position)
      }
    })
  })
  return [coordinates, stair]
}

export const indexToCoordinates = (
  layerIndex: RenderLayerIndex,
  position: RenderPosition
): Position3D => {
  return [positionToXValue(position), 0, indexToZValue(layerIndex)]
}

export const indexToZValue = (layerIndex: RenderLayerIndex, size = 1000) => {
  return (layerIndex - 5) * size
}

export const positionToXValue = (renderPosition: RenderPosition, size = 1000) => {
  return (renderPosition - 1) * size
}
