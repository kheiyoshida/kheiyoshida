import { ModelGrid, RenderModel } from '../types'
import { MockScaffold } from '../__test__/mock'
import { convertToCoords } from './modelToCoords'

test(`${convertToCoords.name}`, () => {
  const modelGrid: ModelGrid = [
    [
      [RenderModel.Floor, RenderModel.Ceil],
      [RenderModel.Floor, RenderModel.Ceil],
      [RenderModel.Floor, RenderModel.Ceil],
    ],
    [[RenderModel.FrontWall], [RenderModel.FrontWall], [RenderModel.FrontWall]],
  ]
  const geometries = convertToCoords(modelGrid, MockScaffold)
  expect(geometries).toHaveLength(9)
})
