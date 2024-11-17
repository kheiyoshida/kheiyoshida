import { ConcreteRenderLayer, RenderGrid, RenderPattern } from '../../../../domain/translate/renderGrid/renderSpec.ts'
import {
  convertCenterModel,
  convertSideModel,
  convertToDefaultModelGrid,
  convertToModelGridLayer,
  trimModelsHorizontal,
  trimModelsVertical,
} from './default.ts'
import { ModelCodeGrid, ModelCodeGridLayer, ModelCode } from './types.ts'

test(`${convertToDefaultModelGrid.name}`, () => {
  const grid: RenderGrid = [null, null, [1, 1, 1], [0, 0, 1], [1, 0, 1], [1, 0, 0]]
  const modelGrid = convertToDefaultModelGrid(grid)
  expect(modelGrid).toHaveLength(4)
})

test(`${convertToModelGridLayer.name}`, () => {
  const renderLayer: ConcreteRenderLayer = [1, 0, 1]
  const modelLayer = convertToModelGridLayer(renderLayer)
  expect(modelLayer).toHaveLength(3)
  expect(modelLayer).toMatchObject([
    [ModelCode.FrontWall, ModelCode.SideWall],
    [ModelCode.Floor, ModelCode.Ceil],
    [ModelCode.FrontWall, ModelCode.SideWall],
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
  expect(result[1][2].includes(ModelCode.FrontWall)).not.toBe(true)
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
      expect(model).not.toBe(ModelCode.SideWall)
    })
  })
})
