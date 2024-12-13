import { RenderPosition } from '../../../domain/query/structure/renderGrid/renderSpec.ts'
import {
  RenderBlock,
  RenderBlockLayer,
  RenderBlockPosition,
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerCoordPosition,
} from './types.ts'

export const getRenderBlock = (
  scaffold: Scaffold,
  { x, z, y }: RenderBlockPosition
): RenderBlock => {
  if (z < 0) throw Error(`z is out of range: ${z}`)
  const block: RenderBlock = {
    front: getBlockLayer(scaffold[z], x),
    rear: getBlockLayer(scaffold[z + 1], x),
  }
  if (y !== undefined && y === -1) {
    return getAdjacentBlockY(block)
  }
  return block
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

export const getAdjacentBlockY = (
  block: RenderBlock,
  position: 'above' | 'below' = 'below'
) => {
  if (position === 'below')
    return {
      front: getAdjacentLayerY(block.front, position),
      rear: getAdjacentLayerY(block.rear, position),
    }
  else
    return {
      front: getAdjacentLayerY(block.front, position),
      rear: getAdjacentLayerY(block.rear, position),
    }
}

export const getAdjacentLayerY = (
  layer: RenderBlockLayer,
  position: 'above' | 'below' = 'below'
): RenderBlockLayer => {
  if (position === 'below')
    return {
      tl: layer.bl,
      tr: layer.br,
      bl: [layer.tl[0], layer.bl[1] + (layer.bl[1] - layer.tl[1]), layer.tl[2]],
      br: [layer.tr[0], layer.br[1] + (layer.br[1] - layer.tr[1]), layer.tr[2]],
    }
  else
    return {
      tl: [layer.tl[0], layer.tl[1] - (layer.bl[1] - layer.tl[1]), layer.tl[2]],
      tr: [layer.tr[0], layer.tr[1] - (layer.br[1] - layer.tr[1]), layer.tr[2]],
      bl: layer.tl,
      br: layer.tr,
    }
}

export const getAdjacentBlockZ = (
  block: RenderBlock,
  delta: { z: number }
): RenderBlock => {
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
