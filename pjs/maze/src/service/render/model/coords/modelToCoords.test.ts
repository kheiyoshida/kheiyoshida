import { ModelGrid, RenderModel } from '../types'
import { MockScaffold } from '../__test__/mock'
import { convertToGeometrySpecList } from './modelToCoords'

test(`${convertToGeometrySpecList.name}`, () => {
  const modelGrid: ModelGrid = [
    [
      [RenderModel.Floor, RenderModel.Ceil],
      [RenderModel.Floor, RenderModel.Ceil],
      [RenderModel.Floor, RenderModel.Ceil],
    ],
    [[RenderModel.FrontWall], [RenderModel.FrontWall], [RenderModel.FrontWall]],
  ]
  const coordinatesList = convertToGeometrySpecList(modelGrid, MockScaffold)
  expect(coordinatesList).toHaveLength(9)
})
