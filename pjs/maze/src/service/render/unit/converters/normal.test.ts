import { ConcreteRenderLayer, RenderGrid, RenderPattern } from '../../../../domain/translate/renderGrid/renderSpec.ts'
import {
  convertCenterModel,
  convertSideModel,
  convertToNormalModelGrid,
  convertToModelGridLayer,
  trimModelsHorizontal,
  trimModelsVertical,
} from './normal.ts'
import { ModelCodeGrid, ModelCodeGridLayer, DynamicModelCode } from '../types.ts'

test(`${convertToNormalModelGrid.name}`, () => {
  const grid: RenderGrid = [null, null, [1, 1, 1], [0, 0, 1], [1, 0, 1], [1, 0, 0]]
  const modelGrid = convertToNormalModelGrid(grid)
  expect(modelGrid).toHaveLength(4)
})

test(`${convertToModelGridLayer.name}`, () => {
  const renderLayer: ConcreteRenderLayer = [1, 0, 1]
  const modelLayer = convertToModelGridLayer(renderLayer)
  expect(modelLayer).toHaveLength(3)
  expect(modelLayer).toMatchObject([
    [DynamicModelCode.FrontWall, DynamicModelCode.SideWall],
    [DynamicModelCode.Floor, DynamicModelCode.Ceil],
    [DynamicModelCode.FrontWall, DynamicModelCode.SideWall],
  ])
})

test(`${trimModelsVertical.name}`, () => {
  /**
   * W F W <- wall on right side doesn't need front wall cuz it's hidden anyway
   * F F W
   * front
   */
  const modelGrid: ModelCodeGrid = [
    [
      convertSideModel(RenderPattern.FLOOR),
      convertCenterModel(RenderPattern.FLOOR),
      convertSideModel(RenderPattern.FILL),
    ],
    [
      convertSideModel(RenderPattern.FILL),
      convertCenterModel(RenderPattern.FLOOR),
      convertSideModel(RenderPattern.FILL),
    ],
  ]
  const result = trimModelsVertical(modelGrid)
  expect(result[1][2].includes(DynamicModelCode.FrontWall)).not.toBe(true)
})

test(`${trimModelsHorizontal.name}`, () => {
  const modelLayer: ModelCodeGridLayer = [
    convertSideModel(RenderPattern.FILL),
    convertCenterModel(RenderPattern.FILL),
    convertSideModel(RenderPattern.FILL),
  ]
  const result = trimModelsHorizontal(modelLayer)
  result.forEach((compound) => {
    compound.forEach((model) => {
      expect(model).not.toBe(DynamicModelCode.SideWall)
    })
  })
})
