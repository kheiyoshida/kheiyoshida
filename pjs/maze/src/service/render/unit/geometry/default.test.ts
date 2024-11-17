import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from '../../../../domain/translate/renderGrid/renderSpec.ts'
import {
  convertCenterModel,
  convertSideModel,
  convertToDefaultModelGrid,
  convertToModelGridLayer,
  trimModelsHorizontal,
  trimModelsVertical,
} from './default.ts'
import { GeometryCode, GeometryCodeGrid, GeometryCodeGridLayer } from '../types.ts'

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
    [GeometryCode.FrontWall, GeometryCode.RightWall],
    [GeometryCode.Floor, GeometryCode.Ceil],
    [GeometryCode.FrontWall, GeometryCode.LeftWall],
  ])
})

test(`${trimModelsVertical.name}`, () => {
  /**
   * W F W <- wall on right side doesn't need front wall cuz it's hidden anyway
   * F F W
   * front
   */
  const modelGrid: GeometryCodeGrid = [
    [
      convertSideModel(RenderPattern.FLOOR, RenderPosition.LEFT),
      convertCenterModel(RenderPattern.FLOOR),
      convertSideModel(RenderPattern.FILL, RenderPosition.RIGHT),
    ],
    [
      convertSideModel(RenderPattern.FILL, RenderPosition.LEFT),
      convertCenterModel(RenderPattern.FLOOR),
      convertSideModel(RenderPattern.FILL, RenderPosition.RIGHT),
    ],
  ]
  const result = trimModelsVertical(modelGrid)
  expect(result[1][2].includes(GeometryCode.FrontWall)).not.toBe(true)
})

test.skip(`${trimModelsHorizontal.name}`, () => {
  const modelLayer: GeometryCodeGridLayer = [
    convertSideModel(RenderPattern.FILL, RenderPosition.LEFT),
    convertCenterModel(RenderPattern.FILL),
    convertSideModel(RenderPattern.FILL, RenderPosition.RIGHT),
  ]
  const result = trimModelsHorizontal(modelLayer)
  result.forEach((compound) => {
    compound.forEach((model) => {
      expect(model).toBe(GeometryCode.FrontWall)
    })
  })
})
