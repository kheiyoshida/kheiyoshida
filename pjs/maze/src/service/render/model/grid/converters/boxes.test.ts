import { RenderGrid } from '../../../../../domain/translate/renderGrid/renderSpec'
import { RenderModel } from '../../types'
import { convertToBoxesModelGrid, convertToModelGridLayer } from './boxes'

test(`${convertToBoxesModelGrid.name}`, () => {
  const grid: RenderGrid = [null, null, [1, 1, 1], [0, 0, 1], [1, 0, 1], [1, 0, 0]]
  const modelGrid = convertToBoxesModelGrid(grid)
  expect(modelGrid).toHaveLength(4)
})

test(`${convertToModelGridLayer.name}`, () => {
  const modelLayer = convertToModelGridLayer([0, 0, 1])
  expect(modelLayer).toEqual([
    [RenderModel.BoxTop, RenderModel.BoxBottom],
    [RenderModel.BoxTop, RenderModel.BoxBottom],
    [RenderModel.BoxTop, RenderModel.BoxMiddle, RenderModel.BoxBottom],
  ])
})
