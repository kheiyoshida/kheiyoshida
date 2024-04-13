import { NodeSpec, PathSpec, TerrainPattern } from './nodeSpec'

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

type TupleIndices<T extends readonly any[]> = Extract<
  keyof T,
  `${number}`
> extends `${infer N extends number}`
  ? N
  : never

export type RenderLayerIndex = TupleIndices<RenderGrid>

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

export const convertToRenderGrid = (path: PathSpec): RenderGrid => _convertToRenderGrid(path).reverse() as RenderGrid

export const _convertToRenderGrid = (path: PathSpec): RenderGrid =>
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
