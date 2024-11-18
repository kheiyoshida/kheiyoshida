import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from '../../../../domain/translate/renderGrid/renderSpec.ts'
import { GeometryCode, GeometryCodeGrid, GeometryCodeGridLayer } from '../types.ts'

export const convertToDefaultModelGrid = (renderGrid: RenderGrid): GeometryCodeGrid => {
  const modelGrid = renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
  return modelGrid
  // return trimModelsVertical(modelGrid)
}

export const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): GeometryCodeGridLayer => {
  const modelLayer = renderLayer.map(convertToModel) as GeometryCodeGridLayer
  return modelLayer
  // return trimModelsHorizontal(modelLayer)
}

export const convertToModel = (
  renderPattern: RenderPattern,
  position: RenderPosition
): GeometryCode[] => {
  if (position === RenderPosition.CENTER) return convertCenterModel(renderPattern)
  else return convertSideModel(renderPattern, position)
}

export const convertCenterModel = (pattern: RenderPattern): GeometryCode[] => {
  if (pattern === RenderPattern.FLOOR) return [GeometryCode.Floor, GeometryCode.Ceil]
  if (pattern === RenderPattern.FILL) return [GeometryCode.FrontWall]
  if (pattern === RenderPattern.STAIR) return [GeometryCode.Floor, GeometryCode.Stair, GeometryCode.Ceil]
  throw Error()
}

export const convertSideModel = (pattern: RenderPattern, position: RenderPosition): GeometryCode[] => {
  if (pattern === RenderPattern.FLOOR) return [GeometryCode.Floor, GeometryCode.Ceil]
  if (pattern === RenderPattern.FILL) {
    if (position === RenderPosition.LEFT) return [GeometryCode.FrontWall, GeometryCode.LeftWall]
    if (position === RenderPosition.RIGHT) return [GeometryCode.FrontWall, GeometryCode.RightWall]
  } 
  throw Error()
}

export const trimModelsVertical = (modelGrid: GeometryCodeGrid): GeometryCodeGrid => {
  return modelGrid.map((modelLayer, i) => {
    if (i === 0) return modelLayer
    return modelLayer.map((compound, position) => {
      if (position === RenderPosition.CENTER) return compound
      if (modelGrid[i - 1][position].includes(GeometryCode.LeftWall)) {
        return compound.filter((model) => model !== GeometryCode.FrontWall)
      }
      return compound
    }) as GeometryCodeGridLayer
  })
}

export const trimModelsHorizontal = (modelLayer: GeometryCodeGridLayer): GeometryCodeGridLayer => {
  if (modelLayer.every((compound) => compound.includes(GeometryCode.FrontWall))) {
    return modelLayer.map((compound) =>
      compound.filter((model) => model !== GeometryCode.LeftWall)
    ) as GeometryCodeGridLayer
  }
  return modelLayer
}
