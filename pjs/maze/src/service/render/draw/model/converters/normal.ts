import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from '../../../../../domain/translate/renderGrid/renderSpec'
import {
  CompoundModelCode,
  ModelCodeGrid,
  ModelCodeGridLayer,
  DynamicModelCode,
  StaticModelCode,
} from '../types'

export const convertToNormalModelGrid = (renderGrid: RenderGrid): ModelCodeGrid => {
  const modelGrid = renderGrid
    .filter((layer): layer is ConcreteRenderLayer => layer !== null)
    .map(convertToModelGridLayer)
  return trimModelsVertical(modelGrid)
}

export const convertToModelGridLayer = (renderLayer: ConcreteRenderLayer): ModelCodeGridLayer => {
  const modelLayer = renderLayer.map(convertToModel) as ModelCodeGridLayer
  return trimModelsHorizontal(modelLayer)
}

export const convertToModel = (
  renderPattern: RenderPattern,
  position: RenderPosition
): CompoundModelCode => {
  if (position === RenderPosition.CENTER) return convertCenterModel(renderPattern)
  else return convertSideModel(renderPattern)
}

export const convertCenterModel = (pattern: RenderPattern): CompoundModelCode => {
  if (pattern === RenderPattern.FLOOR) return [DynamicModelCode.Floor, DynamicModelCode.Ceil]
  if (pattern === RenderPattern.FILL) return [DynamicModelCode.FrontWall]
  if (pattern === RenderPattern.STAIR)
    return [
      // DynamicModelCode.Floor,
      // StaticModelCode.Octahedron, We can't render this legacy static model for now
      DynamicModelCode.Ceil,
    ]
  throw Error()
}

export const convertSideModel = (pattern: RenderPattern): CompoundModelCode => {
  if (pattern === RenderPattern.FLOOR) return [DynamicModelCode.Floor, DynamicModelCode.Ceil]
  if (pattern === RenderPattern.FILL) return [DynamicModelCode.FrontWall, DynamicModelCode.SideWall]
  throw Error()
}

export const trimModelsVertical = (modelGrid: ModelCodeGrid): ModelCodeGrid => {
  return modelGrid.map((modelLayer, i) => {
    if (i === 0) return modelLayer
    return modelLayer.map((compound, position) => {
      if (position === RenderPosition.CENTER) return compound
      if (modelGrid[i - 1][position].includes(DynamicModelCode.SideWall)) {
        return compound.filter((model) => model !== DynamicModelCode.FrontWall)
      }
      return compound
    }) as ModelCodeGridLayer
  })
}

export const trimModelsHorizontal = (modelLayer: ModelCodeGridLayer): ModelCodeGridLayer => {
  if (modelLayer.every((compound) => compound.includes(DynamicModelCode.FrontWall))) {
    return modelLayer.map((compound) =>
      compound.filter((model) => model !== DynamicModelCode.SideWall)
    ) as ModelCodeGridLayer
  }
  return modelLayer
}
