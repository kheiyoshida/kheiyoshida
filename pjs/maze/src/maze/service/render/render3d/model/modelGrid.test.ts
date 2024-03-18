import { ConcreteRenderLayer, RenderGrid } from '../../../../domain/compose/renderSpec'
import { convertToModelGrid, convertToModelGridLayer } from './modelGrid'
import { RenderModel } from './types'

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
