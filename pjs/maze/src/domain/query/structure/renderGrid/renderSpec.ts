import { NodeSpec, PathSpec, TerrainPattern } from './nodeSpec.ts'
import { Grid, GridLayer } from '../../../entities/utils/grid.ts'

/**
 * 6 * 3 grid of rendering patterns
 * note that layer at index 0 is the furthest from the player's position,
 */
export type RenderGrid = Grid<RenderPattern>
export type RenderGridLayer = GridLayer<RenderPattern>

export enum RenderPattern {
  FLOOR = 0,
  FILL = 1,
  STAIR = 2,
  STAIR_WARP = 3,
}

export const convertToRenderGrid = (path: PathSpec): RenderGrid => {
  return path.flatMap((nodeSpec) =>
    nodeSpec
      ? convertToRenderLayer(nodeSpec)
      : [
          [null, null, null],
          [null, null, null],
        ]
  ) as RenderGrid
}

// note the order is closer to further since index 0 is the player's position
const convertToRenderLayer = (nodeSpec: NodeSpec): [RenderGridLayer, RenderGridLayer] => [
  // prettier-ignore
  [detectPattern(nodeSpec.terrain.left), center(nodeSpec), detectPattern(nodeSpec.terrain.right)],
  [RenderPattern.FILL, detectPattern(nodeSpec.terrain.front), RenderPattern.FILL],
]

const center = (nodeSpec: NodeSpec) => {
  if (nodeSpec.stair) {
    return nodeSpec.stair === 'stair' ? RenderPattern.STAIR : RenderPattern.STAIR_WARP
  }
  return RenderPattern.FLOOR
}

const detectPattern = (tp: TerrainPattern) => (tp === 'corridor' ? RenderPattern.FLOOR : RenderPattern.FILL)
