import { DynamicModelCode, ModelGrid } from '../../model'
import { MockScaffold } from '../../scaffold/__test__/mock'
import { convertToGeometrySpecList } from './modelToCoords'

test(`${convertToGeometrySpecList.name}`, () => {
  const modelGrid: ModelGrid = [
    [
      [DynamicModelCode.Floor, DynamicModelCode.Ceil],
      [DynamicModelCode.Floor, DynamicModelCode.Ceil],
      [DynamicModelCode.Floor, DynamicModelCode.Ceil],
    ],
    [[DynamicModelCode.FrontWall], [DynamicModelCode.FrontWall], [DynamicModelCode.FrontWall]],
  ]
  const coordinatesList = convertToGeometrySpecList(modelGrid, MockScaffold)
  expect(coordinatesList).toHaveLength(9)
})
