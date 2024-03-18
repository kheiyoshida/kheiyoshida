import { ModelGrid, RenderModel } from '.'
import { MockScaffold } from '../scaffold/__test__/mock'
import { convertModelGrid } from './modelToGeo'

test(`${convertModelGrid.name}`, () => {
  const modelGrid: ModelGrid = [
    [
      [RenderModel.Floor, RenderModel.Ceil],
      [RenderModel.Floor, RenderModel.Ceil],
      [RenderModel.Floor, RenderModel.Ceil],
    ],
    [[RenderModel.FrontWall], [RenderModel.FrontWall], [RenderModel.FrontWall]],
  ]
  const geometries = convertModelGrid(modelGrid, MockScaffold)
  expect(geometries).toHaveLength(9)
})
