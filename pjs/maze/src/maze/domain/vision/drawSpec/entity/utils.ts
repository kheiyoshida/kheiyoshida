import {
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from '../../../../service/render/compose/renderSpec'
import { toSpliced } from '../../../../utils'
import { Position } from '../../../../utils/position'
import { DrawEntity, DrawEntityGrid, FIRST_LAYER_INDEX, LAST_LAYER_INDEX } from './drawEntity'

/**
 * find layer index of the first appearance of specified entity
 */
export const findLayerIndex = <DE extends DrawEntity>(
  grid: DrawEntityGrid<DE>,
  entity: DE
): number => grid.findIndex((layer) => layer && layer.some((e) => e === entity))

/**
 * find a position by entity pattern
 */
export const findPositionByEntity = <DE extends DrawEntity>(
  grid: DrawEntityGrid<DE>,
  entity: DE
): Position | undefined => {
  const layer = findLayerIndex(grid, entity)
  if (layer !== -1) {
    const pos = grid[layer]!.findIndex((e) => e === entity)
    if (pos !== -1) return [layer, pos]
  }
}

/**
 * remove entity and insert null
 */
export const removeEntity = <D extends DrawEntity>(
  grid: DrawEntityGrid<D>,
  [i, j]: Position
): DrawEntityGrid<D> =>
  grid.map((layer, li) =>
    layer ? (li === i ? toSpliced(layer, j, 1, null) : layer.slice()) : null
  )

/**
 * get grid item or null
 */
export const getGridItem =
  (grid: RenderGrid) =>
  ([i, j]: Position): RenderPattern | null =>
    i <= LAST_LAYER_INDEX && i >= FIRST_LAYER_INDEX && grid[i] !== null && grid[i]![j] !== null
      ? grid[i]![j]
      : null

export const compareGridItem = (
  grid: RenderGrid,
  [i, j]: Position,
  compared: RenderPattern
): boolean => getGridItem(grid)([i, j]) === compared

export const checkCenterFront = (
  grid: RenderGrid,
  [i, j]: Position,
  get = getGridItem(grid)
): [center: boolean, front: boolean] => [
  get([i, RenderPosition.CENTER]) === RenderPattern.FILL,
  get([i + 1, j]) === RenderPattern.FILL || i === LAST_LAYER_INDEX,
]

export const checkAroundCenter = (
  grid: RenderGrid,
  i: number,
  get = getGridItem(grid)
): [left: boolean, right: boolean, center: boolean] => [
  get([i, RenderPosition.LEFT]) === RenderPattern.FLOOR,
  get([i, RenderPosition.RIGHT]) === RenderPattern.FLOOR,
  compareMulti([RenderPattern.FLOOR, RenderPattern.STAIR, null])(
    get([i - 1, RenderPosition.CENTER])
  ),
]

/**
 * if any value can be equal to the compare list
 */
export const compareMulti =
  <T>(c: T[]) =>
  (v: any): boolean =>
    c.some((cv) => cv === v)
