import { PathSpec, TerrainPattern } from './nodeSpec'

export enum RenderPosition {
  LEFT,
  CENTER,
  RIGHT,
}

export enum RenderPattern {
  FLOOR = 0,
  FILL = 1,
  STAIR = 2,
}

type RenderLayer = [RenderPattern, RenderPattern, RenderPattern] | null

export type RenderGrid = [
  RenderLayer,
  RenderLayer,
  RenderLayer,
  RenderLayer,
  RenderLayer,
  RenderLayer,
]

/**
 * convert node specs into render specs
 */
export const convertToRenderGrid = (path: PathSpec): RenderGrid =>
  path.flatMap((ns) =>
    ns
      ? [
          [1, pt(ns.terrain.front), 1],
          [pt(ns.terrain.left), ns.stair ? 2 : 0, pt(ns.terrain.right)],
        ]
      : [null, null]
  ) as RenderGrid

export const pt = (tp: TerrainPattern) => (tp === 'corridor' ? 0 : 1)
