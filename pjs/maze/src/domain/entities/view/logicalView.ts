import { BlockTerrainSpec, PathSpec, TerrainPattern } from './path.ts'
import { Grid, GridLayer } from '../utils/grid.ts'

/**
 * 6 * 3 grid of rendering patterns
 * note that layer at index 0 is the furthest from the player's position,
 */
export type LogicalView = Grid<LogicalTerrainPattern>
export type LogicalViewLayer = GridLayer<LogicalTerrainPattern>

export enum LogicalTerrainPattern {
  FLOOR = 0,
  FILL = 1,
  STAIR = 2,
  STAIR_WARP = 3,
}

export const convertToLogicalView = (path: PathSpec): LogicalView => {
  return path.flatMap((nodeSpec) =>
    nodeSpec
      ? convertToLayers(nodeSpec)
      : [
          [null, null, null],
          [null, null, null],
        ]
  ) as LogicalView
}

// note the order is closer to further since index 0 is the player's position
const convertToLayers = (nodeSpec: BlockTerrainSpec): [LogicalViewLayer, LogicalViewLayer] => [
  // prettier-ignore
  [detectPattern(nodeSpec.terrain.left), center(nodeSpec), detectPattern(nodeSpec.terrain.right)],
  [LogicalTerrainPattern.FILL, detectPattern(nodeSpec.terrain.front), LogicalTerrainPattern.FILL],
]

const center = (nodeSpec: BlockTerrainSpec) => {
  if (nodeSpec.stair) {
    return nodeSpec.stair === 'normal' ? LogicalTerrainPattern.STAIR : LogicalTerrainPattern.STAIR_WARP
  }
  return LogicalTerrainPattern.FLOOR
}

const detectPattern = (tp: TerrainPattern) =>
  tp === 'corridor' ? LogicalTerrainPattern.FLOOR : LogicalTerrainPattern.FILL
