import { RenderGrid, RenderPattern, RenderPosition } from '../../../../../service/render/compose/renderSpec'
import { DrawEntityGrid, LAST_LAYER_INDEX } from '../drawEntity'
import { checkCenterFront } from '../utils'
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
  if (center && front) return 'corner'
  else if (center && !front) return 'wall-hori'
  else if (!center && front) return 'wall-vert'
  else return 'edge-wall'
}
