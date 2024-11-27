import {
  ConcreteRenderLayer,
  RenderGrid,
  RenderPattern,
  RenderPosition,
} from '../../../../domain/translate/renderGrid/renderSpec.ts'
import {
  convertCenter,
  convertSide,
  convertToClassicGeometryCodes,
  convertToCodeGridLayer,
  trimModelsHorizontal,
  trimModelsVertical,
} from './classic.ts'
import { GeometryCode, GeometryCodeGrid, GeometryCodeGridLayer } from '../types.ts'

test(`${convertToClassicGeometryCodes.name}`, () => {
  const grid: RenderGrid = [null, null, [1, 1, 1], [0, 0, 1], [1, 0, 1], [1, 0, 0]]
  const modelGrid = convertToClassicGeometryCodes(grid)
  expect(modelGrid).toHaveLength(4)
})

test(`${convertToCodeGridLayer.name}`, () => {
  const renderLayer: ConcreteRenderLayer = [1, 0, 1]
  const modelLayer = convertToCodeGridLayer(renderLayer)
  expect(modelLayer).toHaveLength(3)
  expect(modelLayer).toMatchObject([
    [GeometryCode.FrontWall, GeometryCode.LeftWall],
    [GeometryCode.Floor, GeometryCode.Ceil],
    [GeometryCode.FrontWall, GeometryCode.RightWall],
  ])
})

// TODO: implement trimming
test.skip(`${trimModelsVertical.name}`, () => {
  /**
   * W F W <- wall on right side doesn't need front wall cuz it's hidden anyway
   * F F W
   * front
   */
  const modelGrid: GeometryCodeGrid = [
    [
      convertSide(RenderPattern.FLOOR, RenderPosition.LEFT),
      convertCenter(RenderPattern.FLOOR),
      convertSide(RenderPattern.FILL, RenderPosition.RIGHT),
    ],
    [
      convertSide(RenderPattern.FILL, RenderPosition.LEFT),
      convertCenter(RenderPattern.FLOOR),
      convertSide(RenderPattern.FILL, RenderPosition.RIGHT),
    ],
  ]
  const result = trimModelsVertical(modelGrid)
  expect(result[1][2].includes(GeometryCode.FrontWall)).not.toBe(true)
})

test.skip(`${trimModelsHorizontal.name}`, () => {
  const modelLayer: GeometryCodeGridLayer = [
    convertSide(RenderPattern.FILL, RenderPosition.LEFT),
    convertCenter(RenderPattern.FILL),
    convertSide(RenderPattern.FILL, RenderPosition.RIGHT),
  ]
  const result = trimModelsHorizontal(modelLayer)
  result.forEach((compound) => {
    compound.forEach((model) => {
      expect(model).toBe(GeometryCode.FrontWall)
    })
  })
})
