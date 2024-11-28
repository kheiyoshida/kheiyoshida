import { GeometryCode, GeometryCodeConverter, GeometryCodeGridLayer } from '../types.ts'
import { ConcreteRenderLayer, RenderPattern } from '../../../../domain/translate/renderGrid/renderSpec.ts'

type PatternCodeMap = Record<RenderPattern, GeometryCode[]>

const makeConverter =
  (patternCodeMap: PatternCodeMap): GeometryCodeConverter =>
  (renderGrid) => {
    return renderGrid
      .filter((layer): layer is ConcreteRenderLayer => layer !== null)
      .map(
        (layer, i) =>
          layer.map((pattern, j) => {
            // if (i === 0 && j === 1) return [...patternCodeMap[pattern], GeometryCode.Floor]
            return patternCodeMap[pattern]
          }) as GeometryCodeGridLayer
      )
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
