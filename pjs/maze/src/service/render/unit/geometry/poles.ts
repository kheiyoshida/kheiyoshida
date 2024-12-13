import { GeometryCode, GeometryCodeConverter, GeometryCodeGridLayer } from '../types.ts'
import { ConcreteRenderLayer, RenderPattern } from '../../../../domain/query/structure/renderGrid/renderSpec.ts'

type PatternCodeMap = Record<RenderPattern, GeometryCode[]>

const makeConverter =
  (patternCodeMap: PatternCodeMap): GeometryCodeConverter =>
  (renderGrid) => {
    return renderGrid
      .filter((layer): layer is ConcreteRenderLayer => layer !== null)
      .map((layer) => layer.map((pattern) => patternCodeMap[pattern]) as GeometryCodeGridLayer)
  }

export const convertToPoles = makeConverter({
  [RenderPattern.FILL]: [GeometryCode.Pole],
  [RenderPattern.FLOOR]: [],
  [RenderPattern.STAIR]: [GeometryCode.Octahedron],
})

export const convertToTiles = makeConverter({
  [RenderPattern.FILL]: [],
  [RenderPattern.FLOOR]: [GeometryCode.Tile],
  [RenderPattern.STAIR]: [GeometryCode.Tile, GeometryCode.Octahedron],
})
