import { RenderGrid, RenderPattern, RenderPosition } from '../../../../../service/render/compose/renderSpec'
import { DrawEntityGrid, LAST_LAYER_INDEX } from '../drawEntity'
import { checkAroundCenter } from '../utils'
import { DrawEntities } from './entities'

export const generateDrawEntityGrid = (
  grid: RenderGrid
): DrawEntityGrid<DrawEntities> =>
  grid.map((layer, li) =>
    layer
      ? layer.map((render, position) =>
          position === RenderPosition.CENTER
            ? render === RenderPattern.STAIR
              ? 'stair'
              : render === RenderPattern.FLOOR
              ? chooseCenterPattern(checkAroundCenter(grid, li))
              : null
            : render === RenderPattern.FLOOR
            ? li === LAST_LAYER_INDEX
              ? 'path-side-forefront'
              : 'path-side'
            : null
        )
      : null
  )

/**
 * choose side
 * @param arr if the space has concrete field (floor or stair)
 */
const chooseCenterPattern = ([left, right, front]: [
  boolean,
  boolean,
  boolean
]): DrawEntities => {
  if (!left && !right && front) return 'f'
  else if (left && !right && !front) return 'l'
  else if (!left && right && !front) return 'r'
  else if (left && !right && front) return 'fl'
  else if (!left && right && front) return 'fr'
  else if (left && right && front) return 'flr'
  else if (left && right && !front) return 'lr'
  else if (!left && !right && !front) return 'deadend'
  throw Error(`couldn't catch pattern`)
}
