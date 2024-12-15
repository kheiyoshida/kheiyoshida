import { Tuple } from 'utils'

/**
 * generic type for expressing grid in the rendering pipeline.
 * - currently we support 3 items in a layer, and 6 layers in total (might change in the future)
 * - each item is nullable
 */
export type Grid<ItemType = unknown, EmptyItemType = null> = Tuple<GridLayer<ItemType, EmptyItemType>, 6>

export type GridLayer<ItemType = unknown, EmptyItemType = null> = Tuple<ItemType | EmptyItemType, 3>

/**
 * position to select item in a grid layer
 */
export enum GPosX {
  LEFT = 0,
  CENTER = 1,
  RIGHT = 2,
}

/**
 * logical names for grid layers
 */
export enum GLayer {
  /**
   * the closest layer from the player
   */
  L0 = 0,
  L1 = 1,
  L2 = 2,
  L3 = 3,
  L4 = 4,

  /**
   * the farthest
   */
  L5 = 5,
}

export const buildInitialGrid = <G extends Grid>(initialItem: () => G[number][number]): G =>
  [...Array(6)].map(() => [...Array(3)].map(initialItem)) as G

export const iterateGrid = (cb: (layer: GLayer, pos: GPosX) => void) => {
  for (let l = 0; l < 6; l++) {
    const layer: GLayer = l
    for (let p = 0; p < 3; p++) {
      const pos: GPosX = p
      cb(layer, pos)
    }
  }
}
