import { Scaffold, ScaffoldLayer, ScaffoldLayerCoordPosition } from '../../scaffold/types'
import { RenderBlockCoords, RenderBlockLayer, RenderBlockPosition } from '../types'
import { RenderPosition } from '../../../../../domain/translate/renderGrid/renderSpec'
import { Position3D, sumPosition3d } from 'p5utils/src/3d'
import { Vector } from 'p5'

export const getRenderBlock =
  (scaffold: Scaffold, { x, z, y }: RenderBlockPosition): RenderBlockCoords => {
    if (z < 0) throw Error(`z is out of range: ${z}`)
    const block: RenderBlockCoords = {
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

export const getAdjacentBlockY = (block: RenderBlockCoords, position: 'above' | 'below' = 'below') => {
  if (position === 'below') 
  return {
    front: getAdjacentLayerY(block.front, position),
    rear: getAdjacentLayerY(block.rear, position),
  }
  else return {
    front: getAdjacentLayerY(block.front, position),
    rear: getAdjacentLayerY(block.rear, position),
  }
}

export const getAdjacentLayerY = (layer: RenderBlockLayer, position: 'above' | 'below' = 'below'): RenderBlockLayer => {
  if (position === 'below')
  return {
    tl: layer.bl,
    tr: layer.br,
    bl: [layer.tl[0], layer.bl[1] + (layer.bl[1] - layer.tl[1]), layer.tl[2]],
    br: [layer.tr[0], layer.br[1] + (layer.br[1] - layer.tr[1]), layer.tr[2]],
  }
  else return {
    tl: [layer.tl[0], layer.tl[1] - (layer.bl[1] - layer.tl[1]), layer.tl[2]],
    tr: [layer.tr[0], layer.tr[1] - (layer.br[1] - layer.tr[1]), layer.tr[2]],
    bl: layer.tl,
    br: layer.tr,
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

export const getBlockCenter = (block: RenderBlockCoords): Position3D => {
  return sumPosition3d(...Object.values(block.front), ...Object.values(block.rear)).map(
    (v) => v / 8
  ) as Position3D
}

export const getSmallerBlock = (block: RenderBlockCoords, ratio = 0.8): RenderBlockCoords => {
  const center = getBlockCenter(block)
  return {
    front: getSmallerLayer(center, block.front, ratio),
    rear: getSmallerLayer(center, block.rear, ratio),
  }
}

export const getSmallerLayer = (center: Position3D, layer: RenderBlockLayer, ratio: number): RenderBlockLayer => {
  const smaller: RenderBlockLayer = Object.fromEntries(
    Object.entries(layer).map(([k, v]) => [k, getReducedPointFromCenter(v, center, ratio)])
  ) as RenderBlockLayer
  return smaller
}

export const getReducedPointFromCenter = (center: Position3D, point: Position3D, ratio: number) => {
  const c = new Vector(...center)
  const v = new Vector(...point)
  const len = v.sub(c).mult(ratio)
  return len.array().map((n,i) => center[i] + n) as Position3D
}
