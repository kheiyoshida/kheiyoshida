import { NodeSpec, PathSpec, TerrainPattern } from './nodeSpec'

export type RenderGrid = [
  RenderLayer,
  RenderLayer,
  RenderLayer,
  RenderLayer,
  RenderLayer,
  RenderLayer,
]

type RenderLayer = [left: RenderPattern, center: RenderPattern, right: RenderPattern] | null

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

export const convertToRenderGrid = (path: PathSpec): RenderGrid =>
  path.flatMap((nodeSpec) =>
    nodeSpec ? convertToRenderLayer(nodeSpec) : [null, null]
  ) as RenderGrid

const convertToRenderLayer = (nodeSpec: NodeSpec): RenderLayer[] => [
  [RenderPattern.FILL, detectPattern(nodeSpec.terrain.front), RenderPattern.FILL],
  [
    detectPattern(nodeSpec.terrain.left),
    nodeSpec.stair ? RenderPattern.STAIR : RenderPattern.FLOOR,
    detectPattern(nodeSpec.terrain.right),
  ],
]

export const detectPattern = (tp: TerrainPattern) =>
  tp === 'corridor' ? RenderPattern.FLOOR : RenderPattern.FILL
