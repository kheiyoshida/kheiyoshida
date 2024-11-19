import { NodeSpec, PathSpec, TerrainPattern } from './nodeSpec'

/**
 * 6 * 3 grid of rendering patterns
 * note that layer at index 0 is the furthest from the player's position,
 */
export type RenderGrid = [
  RenderLayer,
  RenderLayer,
  RenderLayer,
  RenderLayer,
  RenderLayer,
  RenderLayer,
]

export type RenderLayer = ConcreteRenderLayer | null
export type ConcreteRenderLayer = [left: RenderPattern, center: RenderPattern, right: RenderPattern]

export enum RenderPosition {
  LEFT = 0,
  CENTER = 1,
  RIGHT = 2,
}

export enum RenderPattern {
  FLOOR = 0,
  FILL = 1,
  STAIR = 2,
}

export const convertToRenderGrid = (path: PathSpec): RenderGrid =>
  path.flatMap((nodeSpec) =>
    nodeSpec ? convertToRenderLayer(nodeSpec) : [null, null]
  ) as RenderGrid

// note the order is closer to further since index 0 is the player's position
const convertToRenderLayer = (nodeSpec: NodeSpec): RenderLayer[] => [
  // prettier-ignore
  [detectPattern(nodeSpec.terrain.left), center(nodeSpec), detectPattern(nodeSpec.terrain.right)],
  [RenderPattern.FILL, detectPattern(nodeSpec.terrain.front), RenderPattern.FILL],
]

const center = (nodeSpec: NodeSpec) => (nodeSpec.stair ? RenderPattern.STAIR : RenderPattern.FLOOR)

const detectPattern = (tp: TerrainPattern) =>
  tp === 'corridor' ? RenderPattern.FLOOR : RenderPattern.FILL
