import { Scaffold, ScaffoldLayer, ScaffoldLayerCoordPosition } from '../../scaffold/types'
import { RenderBlockCoords, RenderBlockLayer, RenderBlockPosition } from '../types'
import { RenderPosition } from '../../../../domain/translate/renderGrid/renderSpec'

export const makeGetRenderBlock =
  (scaffold: Scaffold) =>
  ({ x, z }: RenderBlockPosition): RenderBlockCoords => {
    return {
      front: getBlockLayer(scaffold[z], x),
      rear: getBlockLayer(scaffold[z + 1], x),
    }
  }

export const getBlockLayer = (
  scaffoldLayer: ScaffoldLayer,
  x: RenderBlockPosition['x']
): RenderBlockLayer => {
  const [left, right] = TranslateMap[x]
  return {
    tl: scaffoldLayer.upper[left],
    tr: scaffoldLayer.upper[right],
    bl: scaffoldLayer.lower[left],
    br: scaffoldLayer.lower[right],
  }
}

const TranslateMap: Record<
  RenderPosition,
  [left: ScaffoldLayerCoordPosition, right: ScaffoldLayerCoordPosition]
> = {
  [RenderPosition.LEFT]: [ScaffoldLayerCoordPosition.LL, ScaffoldLayerCoordPosition.CL],
  [RenderPosition.CENTER]: [ScaffoldLayerCoordPosition.CL, ScaffoldLayerCoordPosition.CR],
  [RenderPosition.RIGHT]: [ScaffoldLayerCoordPosition.CR, ScaffoldLayerCoordPosition.RR],
}

export const getAdjacentBlockY = (block: RenderBlockCoords) => {
  return {
    front: getAdjacentLayerY(block.front),
    rear: getAdjacentLayerY(block.rear),
  }
}

export const getAdjacentLayerY = (layer: RenderBlockLayer): RenderBlockLayer => {
  return {
    tl: layer.bl,
    tr: layer.br,
    bl: [layer.tl[0], layer.bl[1] + (layer.bl[1] - layer.tl[1]), layer.tl[2]],
    br: [layer.tr[0], layer.br[1] + (layer.br[1] - layer.tr[1]), layer.tr[2]],
  }
}

export const getAdjacentBlockZ = (
  block: RenderBlockCoords,
  delta: { z: number }
): RenderBlockCoords => {
  return {
    front: { ...block.rear },
    rear: addValueToLBlockLayer(block.rear, delta),
  }
}

const addValueToLBlockLayer = (
  layer: RenderBlockLayer,
  delta: { x?: number; y?: number; z?: number }
) => {
  return Object.fromEntries(
    Object.entries(layer).map(([k, [x, y, z]]) => [
      k,
      [x + (delta.x || 0), y + (delta.y || 0), z + (delta.z || 0)],
    ])
  ) as RenderBlockLayer
}
