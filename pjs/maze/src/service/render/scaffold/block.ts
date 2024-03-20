import {
  RenderBlockCoords,
  RenderBlockLayer,
  RenderBlockPosition,
  Scaffold,
  ScaffoldLayer,
  ScaffoldLayerCoordPosition,
} from '.'
import { RenderPosition } from '../../../domain/compose/renderSpec'

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

export const getAltBlock = (
  block: RenderBlockCoords,
  delta: { x?: number; y?: number; z?: number }
): RenderBlockCoords => {
  return {
    front: addValueToLBlockLayer(block.front, delta),
    rear: addValueToLBlockLayer(block.rear, delta),
  }
}

export const getAdjacentBlock = (
  block: RenderBlockCoords,
  delta: { z: number }
): RenderBlockCoords => {
  return {
    front: {...block.rear},
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
