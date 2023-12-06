import {
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from 'src/maze/service/render/compose/renderSpec'
import { DrawEntityGrid, LAST_LAYER_INDEX } from '../drawEntity'
import { checkCenterFront, findPositionByEntity, removeEntity } from '../utils'
import { DrawEntities } from './entities'

export const generateDrawEntityGrid = (
  grid: RenderGrid
): DrawEntityGrid<DrawEntities> =>
  cancelAroundStair(_generateDrawEntityGrid(grid))

export const _generateDrawEntityGrid = (
  grid: RenderGrid
): DrawEntityGrid<DrawEntities> =>
  grid.map((layer, li) =>
    layer
      ? layer.map((render, position) =>
          position === RenderPosition.CENTER
            ? render === RenderPattern.STAIR
              ? 'stair'
              : render === RenderPattern.FILL
              ? 'wall-hori'
              : null
            : render === RenderPattern.FILL
            ? determineWallType(checkCenterFront(grid, [li, position]))
            : forefrontSideFloor(li)
        )
      : null
  )

const forefrontSideFloor = (li: number): DrawEntities | null =>
  li === LAST_LAYER_INDEX ? 'wall-hori-extend' : null

const determineWallType = ([center, front]: [
  boolean,
  boolean
]): DrawEntities | null => {
  if (center && front) return null
  else if (center && !front) return 'wall-hori'
  else if (!center && front) return 'wall-vert'
  else return 'edge-wall'
}

export const cancelAroundStair = (grid: DrawEntityGrid<DrawEntities>) => {
  const stair = findPositionByEntity(grid, 'stair')
  if (stair) {
    const [i, j] = stair
    ;[
      [i - 1, j - 1],
      [i - 1, j],
      [i - 1, j + 1],
      [i, j - 1],
      [i, j + 1],
    ].forEach((p) => {
      grid = removeEntity(grid, p as [number, number])
    })
  }
  return grid
}
