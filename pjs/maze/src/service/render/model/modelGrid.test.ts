import { ConcreteRenderLayer, RenderGrid, RenderPattern } from '../../../domain/translate/compose/renderSpec'
import {
  convertCenterModel,
  convertSideModel,
  convertToModelGrid,
  convertToModelGridLayer,
  trimModelsHorizontal,
  trimModelsVertical,
} from './modelGrid'
import { ModelGrid, ModelGridLayer, RenderModel } from './types'

test(`${convertToModelGrid.name}`, () => {
  const grid: RenderGrid = [null, null, [1, 1, 1], [0, 0, 1], [1, 0, 1], [1, 0, 0]]
  const modelGrid = convertToModelGrid(grid)
  expect(modelGrid).toHaveLength(4)
})

test(`${convertToModelGridLayer.name}`, () => {
  const renderLayer: ConcreteRenderLayer = [1, 0, 1]
  const modelLayer = convertToModelGridLayer(renderLayer)
  expect(modelLayer).toHaveLength(3)
  expect(modelLayer).toMatchObject([
    [RenderModel.FrontWall, RenderModel.SideWall],
    [RenderModel.Floor, RenderModel.Ceil],
    [RenderModel.FrontWall, RenderModel.SideWall],
  ])
})

test(`${trimModelsVertical.name}`, () => {
  /**
   * W F W <- wall on right side doesn't need front wall cuz it's hidden anyway
   * F F W
   * front
   */
  const modelGrid: ModelGrid = [
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
  expect(result[1][2].includes(RenderModel.FrontWall)).not.toBe(true)
})

test(`${trimModelsHorizontal.name}`, () => {
  const modelLayer: ModelGridLayer = [
    convertSideModel(RenderPattern.FILL),
    convertCenterModel(RenderPattern.FILL),
    convertSideModel(RenderPattern.FILL),
  ]
  const result = trimModelsHorizontal(modelLayer)
  result.forEach((compound) => {
    compound.forEach((model) => {
      expect(model).not.toBe(RenderModel.SideWall)
    })
  })
})
