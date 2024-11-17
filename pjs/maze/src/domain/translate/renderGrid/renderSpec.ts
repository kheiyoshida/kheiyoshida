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

// We reverse the array for the data's readability in test code so it represents the terrain in sight
export const convertToRenderGrid = (path: PathSpec): RenderGrid =>
  path.reverse().flatMap((nodeSpec) =>
    nodeSpec ? convertToRenderLayer(nodeSpec) : [null, null]
  ) as RenderGrid

const convertToRenderLayer = (nodeSpec: NodeSpec): RenderLayer[] => [
  // prettier-ignore
  [RenderPattern.FILL, detectPattern(nodeSpec.terrain.front), RenderPattern.FILL],
  [detectPattern(nodeSpec.terrain.left), center(nodeSpec), detectPattern(nodeSpec.terrain.right)],
]

const center = (nodeSpec: NodeSpec) => (nodeSpec.stair ? RenderPattern.STAIR : RenderPattern.FLOOR)

const detectPattern = (tp: TerrainPattern) =>
  tp === 'corridor' ? RenderPattern.FLOOR : RenderPattern.FILL
