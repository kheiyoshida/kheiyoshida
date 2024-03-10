import { Position3D } from 'p5utils/src/3d/types'
import {
  RenderGrid,
  RenderLayerIndex,
  RenderPattern,
  RenderPosition,
} from '../../../domain/compose/renderSpec'

export const convertRenderGridIntoCoordinates = (renderGrid: RenderGrid): Position3D[] => {
  const coordinates: Position3D[] = []
  renderGrid.forEach((layer, layerIndex) => {
    if (!layer) return
    layer.forEach((pattern, position) => {
      if (pattern === RenderPattern.FILL) {
        coordinates.push(indexToCoordinates(layerIndex as RenderLayerIndex, position))
      }
    })
  })
  return coordinates
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
